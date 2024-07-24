const inputs = [
    {
        type: "text",
        id: "exercise",
        name: "exercise", 
    },
    {
        type: "text",
        id: "equipment", 
        name: "equipment"
    },
    {
        type: "number",
        id: "reps", 
        name: "reps"
    },
    {
        type: "text",
        id: "special", 
        name: "special"
    },
    {
        type: "number",
        id: "weight", 
        name: "weight"
    },
    {
        type: "text",
        id: "difficulty",
        name: "difficulty",
        list: "difficultynames",
        options: ["easy", "manageable", "hard", "couldn't complete"] 
    },
    {
        type: "datetime-local",
        id: "datetime",
        name: "datetime" 
    },
];

export default inputs;