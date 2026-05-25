from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# -----------------------------
# Database Connection
# -----------------------------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="subscription_system_db"
    )

# -----------------------------
# HOME
# -----------------------------
@app.route("/")
def home():
    return jsonify({"message": "SubManager API Running"})


# =============================
# SIGNUP
# =============================
@app.route("/signup", methods=["POST"])
def signup():

    try:

        data = request.json

        db = get_db()
        cursor = db.cursor()

        query = """
        INSERT INTO users (name,email,password)
        VALUES (%s,%s,%s)
        """

        values = (
            data["name"],
            data["email"],
            data["password"]
        )

        cursor.execute(query, values)
        db.commit()

        cursor.close()
        db.close()

        return jsonify({"message":"User created"}),200

    except Exception as e:

        print("SIGNUP ERROR:",e)
        return jsonify({"error":str(e)}),500


# =============================
# LOGIN
# =============================
@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.json

        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
        SELECT * FROM users
        WHERE email=%s AND password=%s
        """

        cursor.execute(query,(data["email"],data["password"]))

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if user:

            return jsonify({
                "message":"Login success",
                "user_id":user["user_id"],
                "name":user["name"]
            }),200

        else:

            return jsonify({"error":"Invalid credentials"}),401

    except Exception as e:

        print("LOGIN ERROR:",e)
        return jsonify({"error":str(e)}),500


# =============================
# GET SUBSCRIPTIONS
# =============================
@app.route("/subscriptions/<user_id>")
def get_subscriptions(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM subscriptions
        WHERE user_id=%s
    """,(user_id,))

    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)


# =============================
# ADD SUBSCRIPTION
# =============================
@app.route("/add-subscription", methods=["POST"])
def add_subscription():
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        query = """
        INSERT INTO subscriptions
        (
        user_id,
        service_id,
        service_name,
        category,
        plan_type,
        start_date,
        expiry_date,
        price,
        status
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        values = (
            1,
            1,
            data.get("service_name"),
            data.get("category"),
            data.get("plan_type"),
            data.get("start_date"),
            data.get("expiry_date"),
            data.get("price"),
            "Active"
        )
        cursor.execute(query,values)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message":"Subscription Added"}),200

    except Exception as e:

        print("MYSQL ERROR:",e)
        return jsonify({"error":str(e)}),500


# =============================
# DELETE SUBSCRIPTION
# =============================
@app.route("/delete-subscription/<int:id>", methods=["DELETE"])
def delete_subscription(id):

    try:

        db = get_db()
        cursor = db.cursor()

        # 🔥 delete from billing first
        cursor.execute(
            "DELETE FROM billing WHERE subscription_id=%s",
            (id,)
        )

        # 🔥 delete from notifications
        cursor.execute(
            "DELETE FROM notifications WHERE subscription_id=%s",
            (id,)
        )

        # 🔥 finally delete subscription
        cursor.execute(
            "DELETE FROM subscriptions WHERE subscription_id=%s",
            (id,)
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({"message":"Subscription Deleted"}),200

    except Exception as e:

        print("DELETE ERROR:",e)
        return jsonify({"error":str(e)}),500


# =============================
# GET SINGLE SUBSCRIPTION
# =============================
@app.route("/subscription/<int:id>")
def get_subscription(id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM subscriptions WHERE subscription_id=%s",
        (id,)
    )

    data = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(data)


# =============================
# UPDATE SUBSCRIPTION
# =============================
@app.route("/update-subscription/<int:id>", methods=["PUT"])
def update_subscription(id):

    data = request.json

    db = get_db()
    cursor = db.cursor()

    query = """
    UPDATE subscriptions
    SET
    service_name=%s,
    category=%s,
    plan_type=%s,
    price=%s,
    start_date=%s,
    expiry_date=%s
    WHERE subscription_id=%s
    """

    cursor.execute(query,(
        data["service_name"],
        data["category"],
        data["plan_type"],
        data["price"],
        data["start_date"],
        data["expiry_date"],
        id
    ))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"message":"Subscription Updated"})


# =============================
# DASHBOARD
# =============================
@app.route("/dashboard/<user_id>")
def dashboard(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    stats = {}

    cursor.execute("""
        SELECT COUNT(*) as active
        FROM subscriptions
        WHERE user_id=%s AND status='Active'
    """,(user_id,))
    stats["active"] = cursor.fetchone()["active"]

    cursor.execute("""
        SELECT COUNT(*) as expired
        FROM subscriptions
        WHERE user_id=%s AND status='Expired'
    """,(user_id,))
    stats["expired"] = cursor.fetchone()["expired"]

    cursor.execute("""
        SELECT SUM(price) as monthly_spending
        FROM subscriptions
        WHERE user_id=%s AND status='Active'
    """,(user_id,))
    stats["monthly_spending"] = cursor.fetchone()["monthly_spending"] or 0

    stats["upcoming"] = stats["active"]

    cursor.close()
    db.close()

    return jsonify(stats)


# =============================
# MONTHLY CHART
# =============================
@app.route("/monthly-spending/<user_id>")
def monthly_spending(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
    SELECT 
        MONTH(start_date) as month,
        SUM(price) as total
    FROM subscriptions
    WHERE user_id=%s AND start_date IS NOT NULL
    GROUP BY MONTH(start_date)
    ORDER BY MONTH(start_date)
    """

    cursor.execute(query,(user_id,))
    result = cursor.fetchall()

    months = ["Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"]

    data = []

    for row in result:
        if row["month"] is None:
            continue   # skip invalid data

        data.append({
            "month": months[row["month"] - 1],
            "spending": float(row["total"])
        })

    cursor.close()
    db.close()

    return jsonify(data)

# =============================
# RUN SERVER
# =============================
if __name__ == "__main__":
    app.run(debug=True)


