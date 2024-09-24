const runAnalysis = async (editor, callback) => {
    console.log('Writing Analysis JSON Object');

    const data_json = write_machup_analysis_json(editor);
    console.log('Running Analysis...');

    const data_str = JSON.stringify(data_json, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    const url = "/wingcraft/analysis/analysis.php";  // Update if the API changes

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data_str=${encodeURIComponent(data_str)}`,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result_json = await response.json();
        callback(result_json);  // Pass result to the callback
        console.log('Analysis Complete.');

    } catch (error) {
        console.error('Error in the analysis process:', error);
        alert(`Error: ${error.message}`);
    }
};