const {AirplaneRepository} = require('../repositories');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data){
    const airplane  = await airplaneRepository.create(data);
    return airplane;
}

module.exports = createAirplane;