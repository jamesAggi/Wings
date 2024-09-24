export const writeSimulatorJSON = () => {
    // Clone the simModel to ensure no mutation
    const data_json = { ...simModel };

    // Generate metadata for the simulation
    data_json.tag.UUID = THREE.Math.generateUUID();
    data_json.tag.date = new Date();
    data_json.tag.version = "MachUp 4.0"; // Can be made dynamic

    console.log('Simulator JSON Data:', data_json);

    return data_json;
};