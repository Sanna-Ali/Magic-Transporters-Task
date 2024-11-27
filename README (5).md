# Magic Transporters

Welcome to **Magic Transporters**, the future of transporting items easily! This project brings virtual magic to life with special transporters called **Magic Movers**, who are capable of moving important items quickly and efficiently.

## Overview

In the world of **Magic Transporters**, **Magic Movers** are special people equipped with powerful gadgets. They use these gadgets, fueled by virtual magic, to carry various items from one place to another. Each **Magic Mover** has a weight limit (the most they can carry) and a quest state (indicating their current activity, such as resting, loading, or on a mission).

Each **Magic Item** that they carry has:

- **Name**: What the item is called.
- **Weight**: The amount of magic power required to carry it.

## Features

The project includes the following functionalities:

1. **Magic Mover**:

   - Add a new Magic Mover to the system.
   - Assign weight limit and quest state (resting, loading, or on-mission).

2. **Magic Item**:

   - Add a new Magic Item to the system.
   - Define the item's name and weight.

3. **Load a Magic Mover**:

   - Load a Magic Mover with items.
   - Keep track of the loading activity in a database log.

4. **Start a Mission**:

   - Change the state of a Magic Mover to **on-mission**.
   - Prevent any more items from being loaded during the mission.
   - Log the mission start activity in the database.

5. **End a Mission**:

   - Unload all items from the Magic Mover.
   - Change the state of the Magic Mover back to **resting**.
   - Log the mission end activity in the database.

6. **Mission Leaderboard**:
   - Fetch the list of Magic Movers who have completed the most missions.
   - Sort the list in descending order based on the number of missions completed.

## API Endpoints

The REST API for the Magic Transporters project supports the following operations:

- **POST /mover/add**: Add a new Magic Mover.
- **POST /item/add**: Add a new Magic Item.
- **POST /mover/load**: Load a Magic Mover with one or more items.
- **POST /mover/start**: Start a mission for the Magic Mover.
- **POST /mover/end**: End the mission and unload items from the Magic Mover.
- **GET /mover/top**: Fetch the list of Magic Movers who have completed the most missions (in descending order).

## Environment Variables

Create `.env` file in the main folder and add the following

```
PORT= 5000
MONGO_URI= your mongodb uri
NODE_ENV= development

```

## Getting Started

### Prerequisites

To run the project locally, you'll need:

- Node.js
- A database (mongodb)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sanna-Ali/Magic-Transporters-Task

   ```

2. Install dependencies:
   cd Magic-Transporters-Task
   npm install

3. Run the server:
   npm start

4. The server should now be running on http://localhost:5000 .
