import requests

OSRM_URL = "http://router.project-osrm.org"

def get_route(start, end):
    """
    Fetches a route from the OSRM public API.
    start, end = (lat, lon)
    OSRM expects (lon,lat), so we swap them.
    """
    start_str = f"{start[1]},{start[0]}"
    end_str = f"{end[1]},{end[0]}"

    url = f"{OSRM_URL}/route/v1/driving/{start_str};{end_str}?geometries=geojson"

    try:
        response = requests.get(url, timeout=10) # Added a timeout
        response.raise_for_status() # Raises an exception for bad status codes (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching route from OSRM: {e}")
        return {"error": "OSRM server request failed"}