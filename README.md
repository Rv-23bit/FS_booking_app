# FS Club

FS Club is a simple web app for booking fitness classes at a small studio. A member can look at the class schedule and book a spot. An instructor can see the classes they teach and mark who turned up. An admin runs the studio, so they create the classes and approve new instructors.

The project is built on top of a MERN starter template. MERN means MongoDB, Express, React and Node. The backend runs on the server and talks to the database. The frontend is the part you see in the browser.

## The three roles

**Member**
A member signs up and can use the app right away. They can view the schedule, book a class when there is space, see their own bookings and cancel a booking.

**Instructor**
An instructor signs up too, but the new account starts in a pending state. They cannot use the instructor features until an admin approves them. Once approved they can see only the classes assigned to them, open a class to see who booked in, and mark attendance.

**Admin**
The admin is not created by signing up. It is added into the database by a small setup script. The admin can approve or reject instructor requests, create, edit and delete classes, and see a small summary of the studio.

## What the app can do

* Sign up, log in and log out
* Members book and cancel classes, and the app never lets a class go over its limit
* Admin creates, edits and deletes classes and assigns an instructor to each one
* Admin approves or rejects new instructors
* Instructors see their own classes and mark attendance
* Admin sees a small dashboard with a few counts

## What you need before you start

* Node.js installed on your computer
* A MongoDB database (a free MongoDB Atlas account works well)
* Git

## How to set it up on your computer

1. Get the code onto your computer.

```bash
git clone https://github.com/Rv-23bit/FS_booking_app.git
cd FS_booking_app
```

2. Install everything for the root, the backend and the frontend.

```bash
npm run install-all
```

3. Make the environment file for the backend. Copy the example file and then fill in your own values.

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set these values:

* `MONGO_URI` is the connection string for your MongoDB database
* `JWT_SECRET` is any long secret text used to sign login tokens
* `PORT` is the port the backend runs on, for example 5001
* `ADMIN_EMAIL` and `ADMIN_PASSWORD` are the login details for the admin account
* `FRONTEND_URL` is the address of the frontend, only needed when you go live

4. Create the admin account. You only run this once.

```bash
node backend/seed/createAdmin.js
```

5. Add some sample data so the app is easy to look at. This step is optional but recommended for a quick review.

```bash
node backend/seed/seedData.js
```

6. Start the app. This runs the backend and the frontend together.

```bash
npm run dev
```

The frontend opens at `http://localhost:3000` and the backend runs at `http://localhost:5001`.

## Known limitations

* Search and filtering on the class schedule is not implemented yet and remains a backlog item for a future iteration.
* The app is deployed manually to a single EC2 instance, so there is no automated build or deployment pipeline and no automatic scaling if traffic grows.
* The EC2 security group currently restricts inbound access on ports 3000 and 5001 to a single IP address rather than opening it to everyone, so the live link below only loads fully from that IP.

## Live deployment

The app is deployed on AWS EC2 and reachable at:

http://54.206.187.126:3000/

Because of the security group restriction above, this link may not load from every network.