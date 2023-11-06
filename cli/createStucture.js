const process = require('node:process');
const fs = require('fs');

// Entry point of the script
main();

/**
 * The main function that orchestrates the creation of Matrix spaces based on input data.
 */
async function main() {
    // Parse command-line arguments
    const filePath = process.argv.findIndex((i) => i === '-f') > 0 ? process.argv[process.argv.findIndex((i) => i === '-f')+1] : null;
    const token = process.argv.findIndex((i) => i === '-t') > 0 ? process.argv[process.argv.findIndex((i) => i === '-t')+1] : null;
    const baseurl = process.argv.findIndex((i) => i === '-b') > 0 ? process.argv[process.argv.findIndex((i) => i === '-b')+1] : null;
    const homeserver = process.argv.findIndex((i) => i === '-s') > 0 ? process.argv[process.argv.findIndex((i) => i === '-s')+1] : null;
    const help = process.argv.findIndex((i) => i === '-h') > 0;

    // Display help message and exit if the -h flag is provided
    if (help) {
        printOutHelp();
        return;
    }

    // Check if required parameters are provided
    if (!filePath) {
        process.stdout.write('filepath (-f) missing');
        return;
    }
    if (!token) {
        process.stdout.write('token (-t) missing');
        return;
    }
    if (!baseurl) {
        process.stdout.write('baseurl (-b) missing');
        return;
    }
    if (!homeserver) {
        process.stdout.write('homeserver (-s) missing');
        return;
    }

    const matrix = {
        homeserver: homeserver,
        baseUrl: baseurl,
        accessToken: token,
    };

    let data;
    // trying to read and pase input data
    try {
        const filedata = fs.readFileSync(filePath);
        try {
            data = await JSON.parse(filedata);
        } catch (err) {
            process.stdout.write('file not valid json');
            return;
        }
    } catch (err) {
        process.stdout.write('file not found');
        return;
    }

    // Create spaces from the given data
    data = await createSpaces(data, matrix);

    // Assign spaces based on the created spaces
    await assignSpaces(data, matrix);

    // Output the generated spaces as an array to STDOUT
    process.stdout.write(getJsonStringFromGeneratedData(data));

    // Close the application
    process.exit();
}

function getJsonStringFromGeneratedData(data) {
    return JSON.stringify(data.map(entry => {
        return {
            name: entry.name,
            id: entry.id,
            children: entry.children,
            persons: entry.persons,
            template: entry.template,
            type: entry.type,
        };
    }), null, 2);
}

/**
 * Create spaces based on input data and a matrix configuration.
 * @param {Array} inputData - Input data for creating Matrix spaces.
 * @param {Object} matrix - Object containing the matrix configuration.
 * @returns {Array} - The created Matrix spaces data.
 */
async function createSpaces(inputData, matrix) {
    const data = [];
    for (const entry of inputData) {
        const space = { ...entry };
        const createdSpace = await createMatrixSpace(entry, matrix)
            .catch(error => {
            });
        space.id = createdSpace.room_id;
        data.push(space);
    }
    return data;
}

/**
 * Assign spaces as child spaces to parent spaces.
 * @param {Array} data - The Matrix spaces data.
 * @param {Object} matrix - Matrix configuration.
 */
async function assignSpaces(data, matrix) {
    for (const primiary of data) {
        for (const primiaryParent of primiary.parentNames) {
            for (const parent of data.filter(ele => ele.name.trim().replace(' ', '') === primiaryParent.trim().replace(' ', ''))) {
                const resp = await setSpaceAsChildToSpace(primiary.id, parent.id, matrix);
                await new Promise(r => setTimeout(r, 30));
            }
        }
    }
}

/**
 * Set a space as a child to another space.
 * @param {string} childId - The child space's ID.
 * @param {string} parentId - The parent space's ID.
 * @param {Object} matrix - Object containing the matrix configuration.
 * @returns {Promise} - Promise representing the operation.
 */
async function setSpaceAsChildToSpace(childId, parentId, matrix) {
    const body = {
        via: [matrix.homeserver],
        suggested: false,
        auto_join: false,
    };
    return await fetch(matrix.baseUrl + '/_matrix/client/r0/rooms/'+parentId+'/state/m.space.child/'+childId, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + matrix.accessToken },
        body: JSON.stringify(body),
    }).catch();
}

/**
 * Create a Matrix space with specific configuration.
 * @param {Object} data - Data for creating the Matrix space.
 * @param {Object} matrix - Object containing the matrix configuration.
 * @returns {Promise} - Promise representing the operation.
 */
const createMatrixSpace = async (data, matrix) => {
    const opts = (type, template, name) => {
        return {
            preset: 'public_chat',
            power_level_content_override: {
                ban: 50,
                events: {
                    'm.room.avatar': 50,
                    'm.room.canonical_alias': 50,
                    'm.room.encryption': 100,
                    'm.room.history_visibility': 100,
                    'm.room.name': 50,
                    'm.room.power_levels': 50,
                    'm.room.server_acl': 100,
                    'm.room.tombstone': 100,
                    'm.space.child': 0,
                    'm.room.topic': 50,
                    'm.room.pinned_events': 50,
                    'm.reaction': 50,
                    'im.vector.modular.widgets': 50,
                },
                events_default: 50,
                historical: 100,
                invite: 50,
                kick: 50,
                redact: 50,
                state_default: 50,
                users_default: 0,
            },
            name: name,
            room_version: '10',
            creation_content: { type: 'm.space' },
            initial_state: [{
                type: 'm.room.history_visibility',
                content: { history_visibility: 'world_readable' }, //  history
            },
            {
                type: 'dev.medienhaus.meta',
                content: {
                    version: '0.3',
                    type: type,
                    template: template,
                    published: 'public',
                },
            },
            {
                type: 'm.room.guest_access',
                state_key: '',
                content: { guest_access: 'can_join' },
            }],
            visibility: 'private', // visibility is private even for public spaces.
        };
    };

    const req = await fetch(matrix.baseUrl + '/_matrix/client/r0/createRoom', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + matrix.accessToken },
        body: JSON.stringify(opts(
            data.type ? data.type : 'context',
            data.template,
            data.name,
            'world_readable',
        )),
    }).catch((e) => {
    });
    if (req.status === 200) {
        const resp = await req.json();
        return resp;
    }
};

// Display the help message with available options
function printOutHelp() {
    process.stdout.write(`\
    Options supported by the createStructure cli tool:
    -f
      path to the input file *required
    -t
      accesstoken of the matrix account to create the structure *required
    -b
      baseurl of the matrix server (e.g. https://matrix.medienhaus.dev) *required
    -s
      name of the homeserver (e.g. medienhaus.dev) *required
    -h
      Print this help message
    `,
    );
}
