from flask import Flask, jsonify
from flask_cors import CORS
from netmiko import ConnectHandler
import re
from dotenv import load_dotenv
import os
import requests
import json
import urllib3
from datetime import datetime

app = Flask(__name__)
CORS(app)

load_dotenv()

# Disable SSL warnings for ISE requests
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ISEMonitor:
    def __init__(self):
        self.url = "https://10.1.207.61:443/api/v1/deployment/node"
        self.headers = {
            'Authorization': 'Basic YXBpOlliNGM=',
            'Cookie': 'APPSESSIONID=1F726E399FB39164F450DF28397FC238; JSESSIONIDSSO=A786E85A7D3DF6F1F397594E62DE90B6'
        }

    def get_nodes_status(self):
        """
        Récupère le statut de tous les nœuds ISE
        Retourne: Liste de dictionnaires contenant les informations des nœuds
        """
        try:
            response = requests.request("GET", self.url, headers=self.headers, data={}, verify=False)
            data = json.loads(response.text)['response']
            
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            nodes = []
            for node in data:
                nodes.append({
                    'timestamp': timestamp,
                    'fqdn': node['fqdn'],
                    'ip_address': node['ipAddress'],
                    'status': node['nodeStatus'],
                    'is_connected': node['nodeStatus'] == 'Connected',
                    'version': node.get('version', 'N/A'),
                    'roles': node.get('roles', [])
                })
            return nodes
        except Exception as e:
            print(f"Erreur lors de la récupération des données ISE: {e}")
            return []

    def get_nodes_summary(self):
        """
        Retourne un résumé de l'état des nœuds
        """
        nodes = self.get_nodes_status()
        total_nodes = len(nodes)
        connected_nodes = sum(1 for node in nodes if node['is_connected'])
        
        return {
            'total_nodes': total_nodes,
            'connected_nodes': connected_nodes,
            'disconnected_nodes': total_nodes - connected_nodes,
            'health_percentage': (connected_nodes / total_nodes * 100) if total_nodes > 0 else 0,
            'nodes': nodes
        }

def connect_to_device(hostname="10.0.64.120", username="api", password="Um6p@2013", device_type="cisco_ios"):
    """Établit une connexion au contrôleur via Netmiko."""
    try:
        device = {
            "device_type": device_type,
            "host": hostname,
            "username": username,
            "password": password,
            "global_delay_factor": 1,  # Réduit le délai d'attente
            "fast_cli": True  # Active le mode rapide
        }
        connection = ConnectHandler(**device)
        return connection
    except Exception as e:
        print(f"Erreur de connexion: {e}")
        return None

def check_ha_ap():
    connection = connect_to_device()
    try:
        if not connection:
            return {"error": "Impossible de se connecter au WLC"}

        # Exécute les commandes en une seule fois pour réduire les allers-retours
        commands = [
            "show redundancy state",
            "show ap summary"
        ]
        output = connection.send_config_set(commands, exit_config_mode=False)
        
        # Parse HA status
        match_ha = "UP" if re.search(r"Communications\s*=\s*Up", output) else "DOWN"
        
        # Parse AP count
        ap_lines = output.split('\n')
        for line in ap_lines:
            if 'Number of APs' in line:
                match_ap = line.strip().split(':')[1].strip()
                break
        
        connection.disconnect()
        
        return {
            "ha_status": match_ha,
            "ap_count": match_ap
        }
    except Exception as e:
        if connection:
            connection.disconnect()
        return {"error": f"Erreur lors de la vérification WLC : {str(e)}"}

@app.route('/api/wlc/benguerir', methods=['GET'])
def get_wlc_data():
    try:
        data = check_ha_ap()
        if "error" in data:
            return jsonify({"error": data["error"]}), 500
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ise/benguerir', methods=['GET'])
def get_ise_data():
    try:
        monitor = ISEMonitor()
        data = monitor.get_nodes_summary()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)