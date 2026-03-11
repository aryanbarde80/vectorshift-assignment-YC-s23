# VectorShift Frontend Assignment

## Overview
This repository contains my submission for the VectorShift frontend technical assessment. The project is a pipeline builder application built with React, TypeScript, and React Flow, featuring a FastAPI backend.

## 🚀 Features Implemented

### Part 1: Node Abstraction
- Created a reusable `BaseNode` component that all node types extend
- Implemented 5 new custom nodes to demonstrate the abstraction:
  - **API Node** - Makes external API calls
  - **Calculator Node** - Performs mathematical operations
  - **Filter Node** - Filters data based on conditions
  - **Timer Node** - Adds delays in pipeline execution
  - **Storage Node** - Saves/loads data from storage

### Part 2: Styling
- Implemented a clean, modern design using Tailwind CSS
- Consistent color scheme and typography across all nodes
- Responsive layout that works on different screen sizes
- Smooth animations and transitions

### Part 3: Text Node Logic
- Auto-resizing text input that grows/shrinks with content
- Dynamic handle creation for variables in double curly brackets
  - Example: `{{input}}` creates a new input handle on the left side
- Real-time parsing and handle updates

### Part 4: Backend Integration
- Connected frontend to FastAPI backend
- Submit button sends pipeline data to `/pipelines/parse` endpoint
- Backend calculates:
  - Number of nodes
  - Number of edges
  - Whether the pipeline forms a DAG
- User-friendly alert displaying all three values

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Flow (for pipeline visualization)
- Tailwind CSS
- Vite (build tool)
- shadcn-ui components

### Backend
- Python 3.9+
- FastAPI
- Uvicorn

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Python 3.9+
- pip

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`

## 🎯 How to Use

1. **Create Nodes**: Drag and drop nodes from the sidebar onto the canvas
2. **Connect Nodes**: Click and drag from handles to create connections
3. **Edit Text Nodes**: Type in the text area - it auto-resizes
4. **Add Variables**: Use `{{variableName}}` in text nodes to create dynamic handles
5. **Submit Pipeline**: Click the submit button to see pipeline statistics

## 📁 Project Structure

```
frontend/
├── src/
│   ├── nodes/
│   │   ├── BaseNode.tsx        # Base abstraction
│   │   ├── textNode.tsx        # Enhanced text node
│   │   ├── apiNode.tsx         # New custom node
│   │   ├── calculatorNode.tsx  # New custom node
│   │   ├── filterNode.tsx      # New custom node
│   │   ├── timerNode.tsx       # New custom node
│   │   └── storageNode.tsx     # New custom node
│   ├── submit.js               # Updated with backend integration
│   └── ...
backend/
├── main.py                      # FastAPI with DAG checking
└── ...
```

## 🧪 Testing the DAG Check

The backend checks if your pipeline forms a Directed Acyclic Graph (DAG):
- ✅ **Valid DAG**: No cycles in the pipeline
- ❌ **Invalid DAG**: Contains cycles (e.g., A → B → A)

## 📊 API Endpoint

**POST** `/pipelines/parse`
- Request body: `{ nodes: Node[], edges: Edge[] }`
- Response: `{ num_nodes: number, num_edges: number, is_dag: boolean }`

## 🎨 Design Choices

### Node Abstraction
The `BaseNode` component accepts props for title, handles, and children, making it easy to create new node types with minimal code duplication.

### Styling
Used a minimalist design with a focus on clarity and usability. Nodes have distinct colors based on their type for easy identification.

### Text Node Enhancement
Implemented a contentEditable div for auto-resizing and real-time variable parsing using regex to detect `{{variable}}` patterns.

## 🚧 Challenges & Solutions

1. **Dynamic Handle Creation**: Used React Flow's API to dynamically add/remove handles based on variable detection
2. **Auto-resizing Text**: Implemented a hidden div technique to measure text dimensions
3. **DAG Detection**: Used topological sort algorithm to check for cycles in the pipeline

## 📝 Future Improvements

- Add undo/redo functionality
- Implement node grouping
- Add more sophisticated variable validation
- Create node templates library

## 📬 Contact

For any questions about this implementation, please reach out to recruiting@vectorshift.ai

---

**Submitted by**: Aryan Barde  
**Date**: March 11, 2026
