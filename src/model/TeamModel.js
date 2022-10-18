const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'team model' });

const Query = require('../database/Mybatis');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const allTeams = async (requestData) => {
    try {
        const params = {
            teamSeq  : requestData.getBodyValue('teamSeq') != null ? requestData.getBodyValue('teamSeq') : '',
        };
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'selectTeams', params);
        const [dataSet] = await connection.query(queryString);

        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const insertTeam = async (requestData) => {
    try {
        const teamName = requestData.getBodyValue("teamName");
        const params = {
            team_name  : teamName,
          };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'insert', params);
        console.log(queryString);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const updateTeam = async (requestData) => {
    try {
        // const seq = requestData.getSeq();
        // params['seq']= seq;
        const params = {
            seq: requestData.getBodyValue('seq'),
            team_name: requestData.getBodyValue('team_name'),
            sort: requestData.getBodyValue('sort')
        };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'update', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        console.log(e);
        Logger.error(e);
        throw e;
    }
}

const deleteTeam = async (requestData) => {
    try {
        const seq = requestData.getBodyValue('seq');
        const params = {
            'seq' : seq,
        }
        
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'delete', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}


const addCareer  = async (requestData) => {
    try {
        const career = requestData.getBodyValue('career');
        const params = {
            title:          career.title,
            jobType:        career.jobType,
            levels:         career.level,
            salary:         career.salary,
            requirement:    career.requirement,
            roles:          career.role,
            about:          career.about,
            lang:           career.lang
        };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'addJobAd', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const updateCareer  = async (requestData) => {
    try {
        const career = requestData.getBodyValue('career');
        const params = {
            title:          career.title,
            jobType:        career.jobType,
            levels:         career.level,
            salary:         career.salary,
            requirement:    career.requirement,
            roles:          career.role,
            about:          career.about,
            seq:            career.seq,
            lang:           career.lang
        };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'updateJobAd', params);
        const res = await connection.query(queryString);

        return res;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const getCareers = async (requestData) => {
    console.log('===========', requestData);
    const params = {
        seq  : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : '',
        lang  : requestData.getBodyValue('lang') != null ? requestData.getBodyValue('lang') : '',
    };

    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.TEAM, 'getJobAds', params);
    const [dataSet] = await connection.query(queryString);
    return dataSet;
}

const deleteCareer = async (requestData) => {
    const params = {
        seq  : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : '',
    };

    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.TEAM, 'deleteAd', params);

    const res = await connection.query(queryString);
    return res;
}

module.exports = {
    allTeams    ,
    insertTeam  ,
    updateTeam  ,
    deleteTeam  ,
    addCareer   ,
    getCareers  ,
    deleteCareer,
    updateCareer,
  };