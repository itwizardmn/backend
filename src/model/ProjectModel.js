const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'team model' });
const EmployeeModel = require('./EmployeeModel');
const Query = require('../database/Mybatis');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME, DB_TABLE_NAME } = require('../common/Constant');
const { EXPECTATION_FAILED } = require('http-status-codes');

const getProjectsByTeam = async (requestData, id = null) => {

    let teamId = null;

    if(id != null) {
        teamId = id;
    }

    const params = {
        teamSeq :  teamId,
      };

    try {
        const connection = requestData.getConnection();

        const queryString = Query(NAMESPACE.PROJECT, 'getProjectsByTeam', params);
        console.log(queryString);

        const [dataSet] = await connection.query(queryString);
        
        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const insertProject = async (requestData) => {

    const params = {
        teamSeq :  requestData.getBodyValue('teamSeq') != null ? requestData.getBodyValue('teamSeq') : '',
        fileSeq :  requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
        fileName :  requestData.getBodyValue('fileName') != null ? requestData.getBodyValue('fileName') : '',
        projectName :  requestData.getBodyValue('projectName') != null ? requestData.getBodyValue('projectName') : '',
        projectType :  requestData.getBodyValue('projectType') != null ? requestData.getBodyValue('projectType') : '',
        relatedUrl :  requestData.getBodyValue('relatedUrl') != null ? requestData.getBodyValue('relatedUrl') : '',
      };

    try {
        const connection = requestData.getConnection();

        const queryString = Query(NAMESPACE.PROJECT, 'insert', params);

        const res = await connection.query(queryString);
        
        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const getLists = async (requestData) => {
    let name = requestData.getBodyValue('cont') != null ? requestData.getBodyValue('cont') : '';

    const params = {
        db: name != '' ? DB_TABLE_NAME[name] : ''
    };

    try {
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.PROJECT, 'getLists', params);
        const [dataSet] = await connection.query(queryString);
        
        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const updateProperty = async (requestData) => {
    try {
        const p = requestData.getBodyValue('property');
        const params = {
            ['seq']:            p.seq,
            ['team_seq']:       p.team_seq,
            ['project_type']:   p.project_type,
            ['related_url']:    p.related_url,
            ['project_name']:   p.project_name
        }
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.PROJECT, 'updateProperty', params);

        console.log(queryString, '===1111');

        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        console.log(e);
        Logger.error(e);
        throw e;
    }
    
}

const deleteProject = async (requestData) => {
    try {
        const id = requestData.getBodyValue('file_seq');
        const params = {
            seq: requestData.getBodyValue('seq')
        };

        await EmployeeModel.removeSingleFile(requestData, id);
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.PROJECT, 'deleteProject', params);
    
        const res = await connection.query(queryString);
        return res;

    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const updatePhoto = async (requestData) => {

    try {
        const params = {
            ['file'] : requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
            ['seq'] : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : '',
            ['file_seq'] : requestData.getBodyValue('file_seq') != null ? requestData.getBodyValue('file_seq') : ''
        }
    
        await EmployeeModel.removeSingleFile(requestData, params.file_seq);
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.PROJECT, 'updatePhoto', params);
        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

module.exports = {
    getProjectsByTeam,
    insertProject,
    getLists,
    updatePhoto,
    updateProperty,
    deleteProject
}