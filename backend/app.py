from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, make_response, request # Importing the Flask library and some helper functions
import sqlite3 # Library for talking to our database
from datetime import timedelta # We'll be working with dates 
from flask_cors import CORS 
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies, get_jwt, unset_access_cookies
)
from datetime import date
from datetime import timedelta
from datetime import timezone

app = Flask(__name__) # Creating a new Flask app. This will help us create API endpoints hiding the complexity of writing network code!
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_SECRET_KEY'] = 'banana_pudding'
CORS(app, supports_credentials=True)
jwt = JWTManager(app)

# This function returns a connection to the database which can be u ed to send SQL commands to the database
def get_db_connection():
  conn = sqlite3.connect('../database/tessera.db')
  conn.row_factory = sqlite3.Row
  return conn

# When asked, add code in this area
@app.route('/events', methods=['GET'])
def get_events():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    # Start with the base SQL query
    query = 'SELECT * FROM Events'
    params = []
    query_conditions = []

    # Check for the 'afterDate' filter
    after_date = request.args.get('afterDate')
    if after_date:
      query_conditions.append('date > ?')
      params.append(after_date)

    # Check for the 'beforeDate' filter
    before_date = request.args.get('beforeDate')
    if before_date:
      query_conditions.append('date < ?')
      params.append(before_date)
  
    # Check for the 'location' filter
    location = request.args.get('location')
    if location:
      query_conditions.append('location = ?')
      params.append(location)

    # Check for the 'name' filter
    eventName = request.args.get('name')
    if eventName:
      query_conditions.append('name = ?')
      params.append(eventName)

    # Add WHERE clause if conditions are present
    if query_conditions:
      query += ' WHERE ' + ' AND '.join(query_conditions)

    print(query)
        
    # Execute the query with or without the date filter
    cursor.execute(query, params)
    events = cursor.fetchall()

    # Convert rows into a list of dicts to make them serializable
    events_list = [dict(event) for event in events]
    
    conn.close()  # Close the database connection
    
    return jsonify(events_list)  # Return the list of events as JSON

# Create user
@app.route('/user', methods=['POST'])
def create_user():
    # Extract email, username, and password from the JSON payload
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    confirm_password = request.json.get('confirm_password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    profile_pic = request.json.get('profile_pic')
    phone_number = request.json.get('phone_number')

    # Basic validation to ensure all fields are provided
    if not email or not username or not password or not confirm_password or not first_name or not last_name or not phone_number:
        return jsonify({'error': 'All fields (email, username, first name, last name, phone number, password, and password confirmation) are required.'}), 400
    
    if '@' in username:
       return jsonify({'error': 'Invalid character. Username can only contains letters and numbers'}), 400
    if '@' not in email:
       return jsonify({'error': 'Not an email. Emails must contain the \"@\" symbol'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if not check_password_hash(hashed_password, confirm_password):
           return jsonify({'error': 'Passwords do not match'}), 401
        
        # Attempt to insert the new user into the Users table
        cursor.execute('INSERT INTO Users (first_name, last_name, email, username, password_hash, profile_pic, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
                       (first_name, last_name, email, username, hashed_password, profile_pic, phone_number))
        conn.commit()  # Commit the changes to the database

        # Retrieve the user_id of the newly created user to confirm creation
        cursor.execute('SELECT user_id FROM Users WHERE username = ?', (username,))
        new_user_id = cursor.fetchone()

        conn.close()

        return jsonify({'message': 'User created successfully', 'user_id': new_user_id['user_id']}), 201

    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username or email already exists.'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Retrieve the user
@app.route('/user', methods=['GET'])
def get_user():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    # Start with the base SQL query
    query = 'SELECT * FROM Users'
    params = []

    # Check for the 'email' filter
    email = request.args.get('email')
    if email:
      query += ' WHERE email = ?'
      params.append(email)
        
    # Execute the query with or without the date filter
    cursor.execute(query, params)
    events = cursor.fetchall()

    # Convert rows into a list of dicts to make them serializable
    events_list = [dict(event) for event in events]
    
    conn.close()  # Close the database connection
    
    return jsonify(events_list)  # Return the list of events as JSON

# Login
@app.route('/login', methods=['POST'])
def login():
    # Extract  username, and password from the JSON payload
    userEmail = request.json.get('userEmail') # Gonna have to do no @ for username
    password = request.json.get('password')


    # Basic validation to ensure all fields are provided
    if not userEmail or not password:
          return jsonify({'error': 'All fields (username/email and password) are required.'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT email, username, user_id, password_hash FROM Users WHERE email= ? OR username = ?', (userEmail, userEmail))
        
        hashed = cursor.fetchone()
        conn.close()
        if hashed != None:
          if (check_password_hash(hashed['password_hash'], password)): 
            payload = {"email": hashed[0], "username": hashed[1], "user_id": hashed[2]}
            expires = timedelta(days=14)
            access_token = create_access_token(identity=payload, expires_delta=expires)

            resp = jsonify({'login': True})
            set_access_cookies(resp, access_token)
      
            return resp, 200
          
          return jsonify({'error': 'Invalid Password'}), 401
        return jsonify({'error': 'Invalid Username or email'}), 401

    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200

# Delete a user
@app.route('/user/delete', methods=['DELETE'])
def delete_user():
  # Extract usernamefrom the JSON payload
  username = request.json.get('username')

  # Basic validation to ensure all fields are provided
  if not username:
      return jsonify({'error': 'Username is required to delete account.'}), 400
  
  try:
    conn = get_db_connection()
    cursor = conn.cursor()

    found_user = cursor.execute('SELECT username FROM Users WHERE username = ?', (username,))
    

    
    if (found_user != None):
      cursor.execute('DELETE FROM Users WHERE username = ?', (username,))
      conn.commit()
      conn.close()
      return jsonify({'message': 'User successfully deleted'}), 201
    conn.close()
    return jsonify({'error': 'Username not found.'}), 404
  
  except sqlite3.IntegrityError:
        return jsonify({'error': 'Username does not exist.'}), 409
  except Exception as e:
        return jsonify({'error': str(e)}), 500

# Change the users username and/or email 
@app.route('/user/update/<user_id>', methods=['PUT'])
def update_user(user_id):
    new_username = request.json.get('new_username')
    new_email = request.json.get('new_email')
    new_phone_number = request.json.get('new_phone_number')
    new_profile_pic = request.json.get('new_profile_pic')
    
    if not new_username and not new_phone_number and not new_email and not new_profile_pic: 
      return jsonify({'message': 'No new information provided'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if new_username != "":
          cursor.execute('UPDATE Users SET username = ? WHERE user_id = ?', (new_username, user_id,))
          conn.commit()
        if new_email != "":
          cursor.execute('UPDATE Users SET email = ? WHERE user_id = ?', (new_email, user_id,))
          conn.commit()
        if new_phone_number != "":
          cursor.execute('UPDATE Users SET phone_number = ? WHERE user_id = ?', (new_phone_number, user_id,))
          conn.commit()
        if new_profile_pic != "":
          cursor.execute('UPDATE Users SET profile_pic = ? WHERE user_id = ?', (new_profile_pic, user_id,))
          conn.commit()

        conn.close()
      
        return jsonify({'message': 'Username, email, profile picture, and/or phone number successfully changed.'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Allows users to change their password
@app.route('/user/password/change', methods=['PUT'])
def change_password():
    # Retrieve information
    check_username = request.json.get('check_username')
    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')
    verify_password = request.json.get('verify_password')

    # Makes sure proper fields were provided to login
    if not check_username or not old_password or not new_password or not verify_password:
      return jsonify({'error': 'All fields (username, old password, new password, and confirmation password) are required'}), 400
    
    if new_password != verify_password:
       return jsonify({'error': 'Passwords do not match'}), 400

    try:
      conn = get_db_connection()
      cursor = conn.cursor()
      
      # Retrieve the original password
      cursor.execute('SELECT password_hash FROM Users WHERE username = ?', (check_username,))
      check_password = cursor.fetchone()
      hashed_password = generate_password_hash(new_password)
      if check_password != None:
        if (check_password_hash(check_password['password_hash'], old_password)):
            cursor.execute('UPDATE Users SET password_hash = ? WHERE username = ?', (hashed_password, check_username,))
            conn.commit()
        else:
            conn.close()
            return jsonify({'error': 'Password is incorrect. Unable to change password'}), 401

      conn.close()
      return jsonify({'message': 'Password changed successfully'}), 201
      
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Allows users to change their password after forgetting it
@app.route('/user/password/forgot', methods=['PUT'])
def forgot_password():
    # Retrieve information
    email = request.json.get('email')
    new_password = request.json.get('new_password')

    # Makes sure proper fields were provided to update password
    if not email or not new_password:
      return jsonify({'error': 'All fields (email and new password) are required'}), 400

    try:
      conn = get_db_connection()
      cursor = conn.cursor()
      
      # Update the password
      hashed_password = generate_password_hash(new_password)
      cursor.execute('UPDATE Users SET password_hash = ? WHERE email = ?', (hashed_password, email,))
      conn.commit()
      conn.close()

      return jsonify({'message': 'Password changed successfully'}), 201
      
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Allows event creation
@app.route('/events/create', methods=['POST'])
def create_event():
  # Extract event name, location, time, date, description
  event_name = request.json.get('event_name')
  event_location = request.json.get('event_location')
  event_time = request.json.get('event_time')
  event_date = request.json.get('event_date')
  event_description = request.json.get('event_description')
  event_url = request.json.get('url')

  # Ensure all fields are put in
  if not event_name or not event_location or not event_time or not event_date or not event_description or not event_url:
    return jsonify({'error': 'All fields (name, description, location, time, date, and url) are required.'}), 400
  
  try:
    conn = get_db_connection()
    cursor = conn.cursor()

    # Attempt to put new event into the table
    cursor.execute('INSERT INTO Events (name, description, date, time, location, url) VALUES (?, ?, ?, ?, ?, ?)',
                       (event_name, event_description, event_date, event_time, event_location, event_url))
    conn.commit()

    # Retrieve the event name of the newly created event to confirm creation
    cursor.execute('SELECT name FROM Events WHERE name = ?', (event_name,))
    new_event = cursor.fetchone()

    conn.close()

    return jsonify({'message': 'Event created successfully', 'name': new_event['name']}), 201

  except sqlite3.IntegrityError:
    return jsonify({'error': 'Event already exists.'}), 409
  except Exception as e:
    return jsonify({'error': str(e)}), 500

# Returns all emails in the database
@app.route('/user/emails', methods=['GET'])
def get_all_emails():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Base SQL query
    query = 'SELECT email FROM Users'
    params = []

    # Check for the 'email' filter
    email = request.args.get('email')
    if email:
      query += ' WHERE email = ?'
      params.append(email)
    
    # Execute the query with or without the date filter
    cursor.execute(query, params)
    users = cursor.fetchall()

    # Convert rows into a list of dicts to make them serializable
    email_list = [dict(user) for user in users]
    
    conn.close()  # Close the database connection
    
    return jsonify(email_list)  # Return the list of events as JSON

# Awards certain number of tickets based on input to a certain user
@app.route('/tickets/award', methods=['POST'])
def award_ticket():
  # Extract user_id and event_id and number of tickets awarded
  user_id = request.json.get('user_id')
  event_id = request.json.get('event_id')
  purchase_date = request.json.get('purchase_date')
  price = request.json.get('price')
  tickets_awarded = request.json.get('tickets_awarded')

  if not user_id or not event_id or not tickets_awarded:
      return jsonify({'error': 'All fields (user_id, event_id, purchase_date, price, tickets_awarded) are required.'}), 400
   
  try:
    conn = get_db_connection()
    cursor = conn.cursor()

    for i in range(int(tickets_awarded)):
       cursor.execute('INSERT INTO TICKETS (event_id, user_id, purchase_date, price) VALUES (?, ?, ?, ?)', 
                      (event_id, user_id, purchase_date, price,))
       conn.commit()
    
    cursor.execute('SELECT event_id FROM Events WHERE event_id = ?', (event_id,))
    ticket_id = cursor.fetchone()

    conn.close()

    return jsonify({'message': 'Ticket(s) awarded successfully', 'event_id': ticket_id['event_id'], 'tickets_awarded': tickets_awarded}), 201

  except Exception as e:
    return jsonify({'error': str(e)}), 500

# Filter events based on their event id
@app.route('/events/<eventId>', methods=['GET'])
@jwt_required()
def lookupEventByEventID(eventId):

    try:
       conn = get_db_connection()  # Establish database connection
       cursor = conn.cursor()

       cursor.execute('SELECT * FROM Events WHERE event_id = ?', (eventId,))


       events = cursor.fetchall()
       
       # Convert rows into a list of dicts to make them serializable
       events_list = [dict(event) for event in events]
       conn.close()  # Close the database connection
       return jsonify(events_list)  # Return the list of events as JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get the information for the user currently logged in
@app.route('/user/current', methods=['GET'])  
@jwt_required()
def getLoggedInUserInfo():
    jwt = get_jwt()
    user_id = jwt['sub']['user_id']
    
    try:
       conn = get_db_connection()
       cursor = conn.cursor()

       cursor.execute('SELECT * FROM Users WHERE user_id = ?', (user_id,))
       user = cursor.fetchall()

       user_info = [dict(u) for u in user]
       conn.close()

       return jsonify(user_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create a price code 
@app.route('/inventory/prices', methods=['POST'])
def create_prices():
   pricecode = request.json.get('pricecode')
   event_id = request.json.get('event_id')
   value = request.json.get('value')

   if not pricecode or not event_id or not value:
      return jsonify({'error': 'All fields (pricecode, event_id, and value) are required.'}), 400
   
   try:
      conn = get_db_connection()
      cursor = conn.cursor()
      
      cursor.execute('INSERT INTO Prices (pricecode, event_id, value) VALUES (?, ?, ?)', (pricecode, event_id, value,))
      conn.commit()

       # Retrieve the user_id of the newly created user to confirm creation
      cursor.execute('SELECT price_id FROM Prices WHERE pricecode = ? AND event_id = ?', (pricecode, event_id,))
      new_pricecode = cursor.fetchone()

      conn.close()

      return jsonify({'message': 'Pricecode created successfully', 'price_id': new_pricecode['price_id']}), 201

   except sqlite3.IntegrityError:
      return jsonify({'error': 'Pricecode already exists.'}), 409
   except Exception as e:
      return jsonify({'error': str(e)}), 500

# Creates a ticket
@app.route('/inventory/create', methods=['POST'])
def create_ticket():
   event_id = request.json.get('event_id')
   row_name = request.json.get('row_name')
   seat_number = request.json.get('seat_number')
   status = "AVAILABLE"
   pricecode = request.json.get('pricecode')

   if not event_id or not row_name or not seat_number or not pricecode :
      return jsonify({'error': 'All fields (event_id, row_name, seat_number, and pricecode) are required.'}), 400
   
   try:
      conn = get_db_connection()
      cursor = conn.cursor()

      cursor.execute('INSERT INTO Tickets (event_id, row_name, seat_number, status, pricecode) VALUES (?, ?, ?, ?, ?)', (event_id, row_name, seat_number, status, pricecode,))
      conn.commit()

      conn.close()

      return jsonify({'message': 'Ticket created successfully' }), 201

   except sqlite3.IntegrityError:
      return jsonify({'error': 'Ticket already exists.'}), 409
   except Exception as e:
      return jsonify({'error': str(e)}), 500
   
# Retrieve all the tickets (Doesn't display user_id or purchase_date)
@app.route('/inventory', methods=['GET'])
def get_tickets():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    cursor.execute('SELECT event_id, row_name, seat_number, pricecode, status FROM Tickets')

    tickets = cursor.fetchall()
    tickets_list = [dict(ticket) for ticket in tickets]
    
    conn.close()  # Close the database connection
    
    return jsonify(tickets_list)  # Return the list of events as JSON

# Retrieve tickets for a specific user
@app.route('/inventory/<user_id>', methods=['GET'])
def get_user_tickets(user_id):
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    cursor.execute('SELECT event_id, row_name, seat_number, pricecode FROM Tickets WHERE user_id = ?', (user_id,))

    tickets = cursor.fetchall()
    tickets_list = [dict(ticket) for ticket in tickets]
    
    conn.close()  # Close the database connection
    
    return jsonify(tickets_list)  # Return the list of events as JSON
  
# Reserve a ticket for a specific user
@app.route('/inventory/reserve/<user_id>', methods=['PUT'])
def reserve_ticket(user_id):
   status = 'RESERVED'
   event_id = request.json.get('event_id')
   row_name = request.json.get('row_name')
   seat_number = request.json.get('seat_number')
   
   try:
      conn = get_db_connection()
      cursor = conn.cursor()

      cursor.execute('SELECT status FROM Tickets WHERE event_id = ? AND row_name = ? AND seat_number = ?', (event_id, row_name, seat_number,),)
      check_status = cursor.fetchone()

      if check_status['status'] == "AVAILABLE":
        cursor.execute('UPDATE Tickets SET status = ?, user_id = ? WHERE event_id = ? AND row_name = ? AND seat_number = ?', (status, user_id, event_id, row_name, seat_number,),)
        conn.commit()
      else:
         return jsonify({'error': 'Ticket is unavailable'}), 401

      conn.close()
      
      return jsonify({'message': 'Ticket successfully reserved'}), 201
    
   except Exception as e:
      return jsonify({'error': str(e)}), 500
   
# Updates the ticket when it is bought
@app.route('/inventory/buy/<user_id>', methods=['PUT'])
def buy_ticket(user_id):
   status = 'SOLD'
   purchase_date = str(date.today())
   event_id = request.json.get('event_id')
   row_name = request.json.get('row_name')
   seat_number = request.json.get('seat_number')
   
   try:
      conn = get_db_connection()
      cursor = conn.cursor()

      cursor.execute('SELECT status, user_id FROM Tickets WHERE event_id = ? AND row_name = ? AND seat_number = ?', (event_id, row_name, seat_number,),)
      check_user = cursor.fetchone()

      if int(check_user['user_id']) == int(user_id) and check_user['status'] == "RESERVED":
        cursor.execute('UPDATE Tickets SET status = ?, purchase_date = ? WHERE event_id = ? AND row_name = ? AND seat_number = ?', (status, purchase_date, event_id, row_name, seat_number,),)
        conn.commit()
      else:
        return jsonify({'error': 'Ticket is not reserved by current user'}), 401

      conn.close()
      
      return jsonify({'message': 'Ticket successfully bought'}), 201
    
   except Exception as e:
      return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    