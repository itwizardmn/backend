const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'team controller' });

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const { RESPONSE_CODE, RESPONSE_FIELD  } = require('../common/ResponseConst');

const TeamModel = require('../model/TeamModel');

const getTeams = async (req, res) => {
    let requestData = new RequestData(req);
    
    let responseData = new ResponseData(requestData);

    try {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        
        const teamList = await TeamModel.allTeams(requestData);

        responseData.setDataValue(RESPONSE_FIELD.DATA, teamList);

        if(teamList){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const insertTeam = async (req, res) => {
    let requestData = new RequestData(req);
    
    let responseData = new ResponseData(requestData);

    try {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        
        const result = await TeamModel.insertTeam(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        console.log(e);
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const updateTeam = async (req, res) => {
    let requestData = new RequestData(req);
    
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = [ 'seq', 'team_name', 'sort' ];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        
        // let params = {};
        // if(requestData.isBodyExist('teamName')){
        //     let  teamName  = requestData.getBodyValue(teamName);
        //     params['teamName'] = teamName ;
        //   }
        const result = await TeamModel.updateTeam(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const deleteTeam = async (req, res) => {

    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        
        const result = await TeamModel.deleteTeam(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        console.log(e);
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const addCareer = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = [ 'career'];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }

        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const result = await TeamModel.addCareer(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        } else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }

    } catch (e) {
        console.log(e);
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
    
}

const getCareers = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const result = await TeamModel.getCareers(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
            responseData.setDataValue(RESPONSE_FIELD.DATA, result);
        } else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
}

const deleteCareer = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);
    
    try {
        const fieldList = [ 'seq'];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }

        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const result = await TeamModel.deleteCareer(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);            
        } else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        console.log(e);
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
}

const updateCareer = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = [ 'career'];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }

        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const result = await TeamModel.updateCareer(requestData);

        if(result){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        } else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }

    } catch (e) {
        console.log(e);
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
    
}

module.exports = {
    getTeams,
    insertTeam,
    updateTeam,
    deleteTeam,
    addCareer,
    getCareers,
    deleteCareer,
    updateCareer
  };