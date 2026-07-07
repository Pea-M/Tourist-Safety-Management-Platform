import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

# --- Load Credentials ---
TATUM_API_KEY = os.getenv("TATUM_API_KEY")
SERVER_WALLET_PRIVATE_KEY = os.getenv("SERVER_WALLET_PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
CONTRACT_ABI_STRING = os.getenv("CONTRACT_ABI")

if not all([TATUM_API_KEY, SERVER_WALLET_PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI_STRING]):
    raise ValueError("One or more environment variables are missing. Please check your .env file.")

CONTRACT_ABI = json.loads(CONTRACT_ABI_STRING)

# --- FIX: These are the correct URLs for the FREE Tatum plan on the Sepolia network ---
TATUM_WRITE_URL = "https://api.sepolia.tatum.io/v4/blockchain/sc/custodial/call"
TATUM_READ_URL = "https://api.sepolia.tatum.io/v4/blockchain/sc/call"

CHAIN = "ethereum-sepolia"

print("✅ Blockchain utilities configured to use the latest Tatum API for Sepolia.")

# --- Reusable Functions ---

def create_tourist_id_on_chain(unique_tourist_id: str):
    """
    Calls the createUserID function on the smart contract via the Tatum API.
    """
    headers = { 'x-api-key': TATUM_API_KEY, 'Content-Type': 'application/json' }
    payload = {
        "chain": CHAIN,
        "contractAddress": CONTRACT_ADDRESS,
        "methodName": "createUserID",
        "methodABI": next((item for item in CONTRACT_ABI if item.get("name") == "createUserID"), None),
        "params": [unique_tourist_id],
        "fromPrivateKey": SERVER_WALLET_PRIVATE_KEY
    }
    
    if payload["methodABI"] is None:
        return {"success": False, "error": "Could not find createUserID method in ABI."}

    try:
        print(f"⏳ Sending transaction to new Tatum endpoint for '{unique_tourist_id}'...")
        response = requests.post(TATUM_WRITE_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        tx_hash = data.get("txId")

        print(f"✅ Transaction sent successfully! Tx Hash: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}

    except requests.exceptions.RequestException as e:
        print(f"❌ Error creating ID via Tatum: {e}")
        if e.response:
            print(f"Response body: {e.response.text}")
        return {"success": False, "error": str(e)}

def verify_tourist_id_on_chain(unique_tourist_id: str):
    """
    Calls the verify function on the smart contract via the Tatum API.
    """
    headers = { 'x-api-key': TATUM_API_KEY, 'Content-Type': 'application/json' }
    payload = {
        "chain": CHAIN,
        "contractAddress": CONTRACT_ADDRESS,
        "methodName": "verify",
        "methodABI": next((item for item in CONTRACT_ABI if item.get("name") == "verify"), None),
        "params": [unique_tourist_id],
    }

    if payload["methodABI"] is None:
        return {"success": False, "error": "Could not find verify method in ABI."}

    try:
        response = requests.post(TATUM_READ_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        is_verified = data.get("data")
        
        return {"success": True, "is_verified": is_verified}

    except requests.exceptions.RequestException as e:
        print(f"❌ Error verifying ID via Tatum: {e}")
        if e.response:
            print(f"Response body: {e.response.text}")
        return {"success": False, "error": str(e)}