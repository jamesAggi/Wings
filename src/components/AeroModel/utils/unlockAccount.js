export const unlockAccount = (callback) => {
    const data_json = {
        pswrd: prompt("Please enter your password"),
    };

    const data_str = JSON.stringify(data_json, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

    console.log(data_str); // Be careful with logging sensitive information like passwords
    const url = "/wp-content/themes/aperture-child/MachUp/analysis/V2.0/unlock.php/";

    $.ajax({
        type: 'POST',
        url: url,
        data: { data_str },
        beforeSend: () => {
            $('#resp').html('Loading...');
        },
        timeout: 100000,
        error: (xhr, status, error) => {
            console.log('Error in ajax call to server.');
            alert('Error: ' + xhr.status + ' - ' + error);
        },
        success: (Result) => {
            const result_json = $.parseJSON(Result);
            console.log('Unlock Complete.');
            callback(result_json);
        }
    });
};