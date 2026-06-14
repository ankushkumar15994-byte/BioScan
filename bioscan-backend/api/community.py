from fastapi import APIRouter, HTTPException
from api.database import users_collection, scans_collection
from datetime import datetime

router = APIRouter()

def time_ago(dt):
    if not dt:
        return "Unknown"
    now = datetime.utcnow()
    diff = now - dt
    if diff.days > 0:
        return f"{diff.days} days ago"
    hours = diff.seconds // 3600
    if hours > 0:
        return f"{hours} hours ago"
    minutes = diff.seconds // 60
    if minutes > 0:
        return f"{minutes} min ago"
    return "Just now"

@router.get("/stats")
async def get_stats():
    if users_collection is None or scans_collection is None:
        return {
            "active_members": 0,
            "total_scans": 0,
            "disease_classes": 38,
            "system_uptime": "24/7"
        }
        
    total_users = users_collection.count_documents({})
    total_scans = scans_collection.count_documents({})
    
    return {
        "active_members": total_users,
        "total_scans": total_scans,
        "disease_classes": 38,
        "system_uptime": "24/7"
    }

@router.get("/recent-scans")
async def get_recent_scans():
    if scans_collection is None:
        return {"scans": []}
        
    recent = list(scans_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(10))
    
    formatted_scans = []
    for scan in recent:
        email = scan.get("user_email")
        user = users_collection.find_one({"email": email}) if email else None
        
        name = user.get("name", "Unknown User") if user else "Unknown User"
        time_str = time_ago(scan.get("created_at"))
        
        formatted_scans.append({
            "user": name,
            "crop": scan.get("crop_name", "Unknown"),
            "disease": scan.get("disease_name", "Unknown"),
            "confidence": scan.get("confidence", 0),
            "time": time_str
        })
        
    return {"scans": formatted_scans}

@router.get("/top-contributors")
async def get_top_contributors():
    if scans_collection is None:
        return {"contributors": []}
        
    pipeline = [
        {"$group": {"_id": "$user_email", "scan_count": {"$sum": 1}}},
        {"$sort": {"scan_count": -1}},
        {"$limit": 5}
    ]
    
    top = list(scans_collection.aggregate(pipeline))
    
    formatted = []
    for t in top:
        email = t["_id"]
        count = t["scan_count"]
        user = users_collection.find_one({"email": email}) if email else None
        
        name = user.get("name", "Unknown User") if user else "Unknown User"
        role = user.get("occupation", "Plant Enthusiast") if user else "Plant Enthusiast"
        
        if not role:
            role = "Plant Enthusiast"
            
        formatted.append({
            "name": name,
            "scans": count,
            "role": role
        })
        
    return {"contributors": formatted}
