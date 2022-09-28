const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user model' });
const bcrypt = require('bcrypt');
const FileModel = require('./FileModel');
const Query = require('../database/Mybatis');
const path = require('path');
const fs = require('fs');
const fileDir = path.resolve(process.env.UPLOAD_DIR);

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const selectEmployee = async (requestData, email) => {
  try {

    const params = {
      ['email'] :  email
    };

    const connection = requestData.getConnection();

    const queryString = Query(NAMESPACE.USER,'loginEmployee', params);
    const [dataSet] = await connection.query(queryString);
    return dataSet[DB_RESULT.ROW_FIRST];
  }
  catch (e) {
    Logger.error(e.stack);
    throw e;
  }
};

const removeSingleFile = async (requestData, id) => {
  let file = await FileModel.loadFile(requestData, id);
  let file_name;
  if (file && file.length > 0) {
    file_name = file[0].file_name;
    if (fs.existsSync(fileDir + '/' + file_name)) {
      fs.unlink(fileDir + '/' + file_name, (err) => {
        if (err) {
          return;
        }
        return;
      })
    }
  }
}

const selectEmployeePersonal = async (requestData, seq) => {
  try {
    const params = {
      ['seq'] : seq
    };

    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.USER,'personalEmployee', params);
    const [dataSet] = await connection.query(queryString);
    return dataSet[DB_RESULT.ROW_FIRST];

  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}

const updateProfile = async (requestData) => {
  const params = {
    ['profile'] : requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
    ['seq']     : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : ''
  }
  try {

    const file = await selectEmployee(requestData, params.seq);
    if(file) {
      await removeSingleFile(requestData, file.profile);
    }
    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.USER, 'updateUserProfile', params);
    const res = await connection.query(queryString);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}

const insertEmployee = async (requestData) => {
  try {
      const resume = requestData.getBodyValue('resume');
      const name    = resume.firstname;
      const email  = resume.email;
      const phone      = resume.phone;
      const salt   = await bcrypt.genSalt();
      const password  = await bcrypt.hash(phone, salt);
      const approved = requestData.payload.userID;
      const change = requestData.getBodyValue('change');
      const pro_seq = change.profession;
      const team_seq = change.team;
      const seq = resume.seq;
      const levels = change.levels;

      const params = {
        ['name']      : name,
        ['email']     : email,
        ['phone']     : phone,
        ['salt']      : salt,
        ['password']  : password,
        ['approved']  : approved,
        ['pro_seq']   : pro_seq,
        ['team_seq']  : team_seq,
        ['seq']       : seq,
        ['levels']    : levels
      };

      let check = await selectEmployee(requestData, email);
      if (check && check.seq) {
        return { status: 'existed' };
      } else {
        const connection = requestData.getConnection();

        const statement = Query(NAMESPACE.USER,'insertEmployee', params);
        const res = await connection.query(statement);

        return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
      }
  }
  catch (e) {
    console.log(e);
      Logger.error(e.stack);
      throw e;
  }
};

const insertVote = async (requestData) => {
  try {
    const vote = requestData.getBodyValue('newVote');
    const seq = requestData.payload.seq;
    const params = {
      ['employee_seq']      : seq,
      ['vote']              : vote.type,
      ['title']             : vote.title,
      ['content']           : vote.content,
      ['hidden']            : vote.hidden ? 1 : 0
    };
    
    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'insertVote', params);
    const res = await connection.query(statement);
    
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
  } catch (e) {
    console.log(e);
    Logger.error(e.stack);
    throw e;
  }
}

const selectVotes = async (requestData) => {
  try {
    const seq = requestData.payload.seq;
    const params = {
      ['seq'] : seq
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'selectVotes', params);
    const res = await connection.query(statement);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST]};

  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}

const getProfessions = async (requestData) => {
  try {
    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'selectProfessions');
    const res = await connection.query(statement);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST]};
  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}

const updateStatusCareer = async (requestData) => {
  try {
    const resume = requestData.getBodyValue('resume');
    const change = requestData.getBodyValue('change');
    const seq = resume.seq;
    const status = change.status;

    const params = {
      ['seq']     : seq,
      ['status']  : status
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'updateCareerStatus', params);
    const res = await connection.query(statement);
    // console.log(res[DB_RESULT.ROW_FIRST], '=================');

    if (status == 'accepted') {
      let add = await insertEmployee(requestData);
      if (add != null) {
        return { status: 'success' };
      }
    } else {
      return { status: 'success' };
    }
  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}

const updateCareer = async (requestData) => {
  try {
    const data = requestData.getBodyValue('resume');
    const seq = data.seq;
    const lastname = data.main.lastname;
    const firstname = data.main.firstname;
    const birthdate = data.main.birthdate;
    const phone = data.main.phone;
    const register = data.main.register;
    const email = data.main.email;
    const address = data.main.address;
    const family = data.family;
    const edu = data.edu;
    const lang = data.lang;
    const experience = data.experience;
    const personal = data.personal;
    const skill = data.skill;

    const params = {
      ['lastname']      : lastname,
      ['firstname']     : firstname,
      ['birthdate']     : birthdate,
      ['phone']         : phone,
      ['register']      : register,
      ['email']         : email,
      ['address']       : address,
      ['family']        : family,
      ['edu']           : edu,
      ['lang']          : lang,
      ['experience']    : experience,
      ['personal']      : personal,
      ['skill']         : skill,
      ['seq']           : seq
    };
    
    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'updateEmployeeCareer', params);
    console.log('=============', statement, params);
    const res = await connection.query(statement);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};

  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}
const addCareer = async (requestData) => {
  try {
    const data = requestData.getBodyValue('resume');
    const lastname = data.main.lastname;
    const firstname = data.main.firstname;
    const birthdate = data.main.birthdate;
    const phone = data.main.phone;
    const register = data.main.register;
    const email = data.main.email;
    const address = data.main.address;
    const family = data.family;
    const edu = data.edu;
    const lang = data.lang;
    const experience = data.experience;
    const personal = data.personal;
    const skill = data.skill;

    const params = {
      ['lastname']      : lastname,
      ['firstname']     : firstname,
      ['birthdate']     : birthdate,
      ['phone']         : phone,
      ['register']      : register,
      ['email']         : email,
      ['address']       : address,
      ['family']        : family,
      ['edu']           : edu,
      ['lang']          : lang,
      ['experience']    : experience,
      ['personal']      : personal,
      ['skill']         : skill
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'addCareer', params);

    const res = await connection.query(statement);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
  } catch (e) {
    Logger.error(e.stack);
    throw e;
  }
}

module.exports = {
  selectEmployee,
  insertEmployee,
  addCareer,
  updateProfile,
  selectEmployeePersonal,
  updateCareer,
  insertVote,
  selectVotes,
  getProfessions,
  updateStatusCareer,
  removeSingleFile
};