import { writeSimulatorJSON } from '../Simulation/writeSimulatorJson';

export const runFlightSimulation = async (editor, callback) => {
    console.log('Running Flight Simulator...');

    // Create the JSON for the simulator
    const data_json = writeSimulatorJSON(editor);

    // Stringify the JSON data
    const data_str = JSON.stringify(data_json, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    console.log(data_str);

    // Set the URL for the simulation
    const url = '/wingcraft/analysis/simulator.php'; // Update the path as per your structure

    try {
        // Send the request using fetch
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data_str })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON response
        const result_json = await response.json();
        console.log('Simulation Complete.');
        console.log(result_json);

        // Pass the result to the callback
        callback(result_json);

    } catch (error) {
        console.error('Error in simulation call:', error);
        alert(`Simulation error: ${error.message}`);
    }
};