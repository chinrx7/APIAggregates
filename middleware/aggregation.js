const axios = require('axios');
const { config, aggCfg } = require('../app')
const logger = require('./log');

const Url = config.API;
const tagCfgs = aggCfg;


module.exports.getData = async () => {
    const token = await getToken();
    getAgg();
}

getToken = async () => {
    let token;
    const body = { user: "Solarsys", password: "PP@@ssw0rd555" };
    await axios.post(Url + 'authen', body)
        .then(function (res) {
            token = res.data.Access.Token;
        })

    return token;
}

module.exports.AggTask = async () => {
    const token = await getToken();
    const tagAgg = await LoadTagConfgig(token);

    console.log(tagAgg[0].Tags.length);
}

LoadTagConfgig = async (token) => {
    let plotTag;
    await axios.post(Url + 'getplottag', '', { headers: { Authorization: token } })
        .then((res) => {
            plotTag = res.data;
        });

    let groupPlot = [];
    const g  = plotTag.length/10000;
    
    
    const nLoop = Math.ceil(g);

    let nTag

    for(let i=0; i< nLoop;i++){

        nTag = i*10000;

        const gCfg = { Name: 'G'+i, Tags: [] }
        if((i+1) === nLoop){
            gCfg.Tags.push(plotTag.slice(nTag,plotTag.length))
        }
        else{
            gCfg.Tags.push(plotTag.slice(nTag,nTag+9999));
        }

        groupPlot.push(gCfg);

        
        //console.log(G)

    }

    tranFormData(groupPlot)
    return groupPlot;
}

tranFormData = (gTags) => {


    gTags.forEach(g =>{
        console.log(g.Name)
       g.Tags.forEach(t => {
        console.log(t)
       })
    })


}

getAgg = async () => {
    const token = await getToken();
    const req = tranFormReq(tagCfgs);

    console.log(req)
    let result;

    //console.log(Url)

    const headers = { Authorization: token };

    await axios.post(Url + 'getplotdata', req, { headers: { Authorization: token } })
        .then((res) => {
            //console.log(res.data)
            result = res.data;
        });


    const saveReq = tranFormData(result);

    console.log(saveReq)

    if(saveReq.length >0){
    await axios.post(Url + 'insertagg',  saveReq, { headers: { Authorization: token } })
        .then((res) => {
            console.log(res.data);
            if(res.data === 'ok'){
                logger.loginfo('insert agg : ' + new Date);
            }
            else{
                logger.loginfo('insert agg not success!!!');
            }
        });
    }
}

getReqTime = () => {
    let StartTime, EndTime;
    StartTime = new Date;
    EndTime = new Date;
    StartTime = StartTime.setMinutes(StartTime.getMinutes() - 10);
    StartTime = new Date(StartTime);
    //console.log(StartTime, EndTime)
    return { StartTime: StartTime, EndTime: EndTime }
}

tranFormData2 = (resData) => {
    //console.log(resData)
    let reqData = [];
    resData.forEach(res => {
        //console.log(res.Name);
        const r = { Name: res.Name, Records: [] }
        let i = 1;
        const cnt = Object.keys(res.records).length;
        res.records.forEach(v => {
            //console.log(v)
            if (cnt !== i) {
                r.Records.push(v);
            }
            i = i + 1;
        })
        const cntp = Object.keys(r.Records).length;
        if (cntp > 0) {
            reqData.push(r);
        }
    })

    //console.log(reqData)
    return reqData;
}

tranFormReq = (tCfgs) => {
    const reqTime = getReqTime();
    let req = [];

    //console.log(tCfgs[0]);
    tCfgs.forEach(g => {
        g.Tags.forEach(t => {
            //console.log(t)
            const r = {
                Name: t, Options: {
                    Interval: config.Interval, Time: "", StartTime: reqTime.StartTime,
                    EndTime: reqTime.EndTime
                }
            }
            req.push(r);
        })
    });

    return req;
}