'use client'

import { useState } from "react";
import Button from "@/app/components/button";


export default function Board() {



    const [tasks, setTasks] = useState({
        todo: [],
        'in-progress': [],
        done: [],
    });

    return (
        <div className="grid grid-cols-3 gap-4">
            {Object.keys(tasks).map((column) => (
                <div key={column} className="bg-white rounded shadow p-4">
                    <Button/>
                    <h2 className="text-lg font-semibold mb-3 capitalize">{column.replace('-', ' ')}</h2>
                    <div className="space-y-2">
                        {tasks[column].map((task, index) => (
                            <div key={index} className="p-2 bg-gray-200 rounded">
                                {task}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
