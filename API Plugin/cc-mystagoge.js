require('dotenv').config();
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { default: i18n } = require('new-i18n')
let reqPath = path.join(__dirname, '../../');
const newi18n = new i18n(path.join(reqPath, process.env.MystagogeStore), ["de","en"], "de");

/**
 * 
 * @param {string} 
 * @returns {object}
 * 
 */

function CountChar(input) {
    const {max, ...counts} = (input || "").split("").reduce(
    (a, c) => {
        a[c] = a[c] ? a[c] + 1 : 1;
        a.max = a.max < a[c] ? a[c] : a.max;
        return a;
    },
    { max: 0 }
    );
    return Object.entries(counts).filter(([k, v]) => v === max);
}

const PluginConfig = {
};

/* Plugin info */
const PluginName = 'CC-Mystagoge';
const PluginRequirements = [];
const PluginVersion = '0.0.1';
const PluginAuthor = 'BolverBlitz';
const PluginDocs = 'Privat';

const GETlimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15
  });

const Start = Joi.object({
    lang: Joi.string().required().regex(/^[a-z\d\s]*$/i),
});

const QandA = Joi.object({
    lang: Joi.string().required().regex(/^[a-z\d\s]*$/i),
    data: Joi.string().required().regex(/^[a-z\d\s]*$/i),
});
  
const router = express.Router();

router.get('/start', GETlimiter, async (reg, res, next) => {
    try {
        const value = await Start.validateAsync(reg.query);
        res.status(200);
        res.json({
            start: newi18n.translate(value.lang, "Start"),
            message: newi18n.translate(value.lang, "StartLanguage"),
            currentlang: newi18n.translate(value.lang, "CurrentLang"),
            button: newi18n.translate(value.lang, "JoinMystagoge"),
            avaible: newi18n.languages
        });
    } catch (error) {
      next(error);
    }
  });

router.get('/QandA', GETlimiter, async (reg, res, next) => {
    try {
        const value = await QandA.validateAsync(reg.query);
        var Antworten = [];
        if(value.data === "first"){
          Antworten.push({letter: "A", message: newi18n.translate(value.lang, '0A')});
          Antworten.push({letter: "B", message: newi18n.translate(value.lang, '0B')});
          Antworten.push({letter: "C", message: newi18n.translate(value.lang, '0C')});
          Antworten.push({letter: "D", message: newi18n.translate(value.lang, '0D')});
          Antworten.push({letter: "E", message: newi18n.translate(value.lang, '0E')});
          Antworten.push({letter: "F", message: newi18n.translate(value.lang, '0F')});
          res.status(200);
          res.json({
              frage: newi18n.translate(value.lang, '0Frage'),
              antworten: Antworten
          });
        }else{
          if(newi18n.translate(value.lang, value.data.length + 'A') !== null){
            Antworten.push({letter: "A", message: newi18n.translate(value.lang, value.data.length + 'A')});
            Antworten.push({letter: "B", message: newi18n.translate(value.lang, value.data.length + 'B')});
            Antworten.push({letter: "C", message: newi18n.translate(value.lang, value.data.length + 'C')});
            Antworten.push({letter: "D", message: newi18n.translate(value.lang, value.data.length + 'D')});
            Antworten.push({letter: "E", message: newi18n.translate(value.lang, value.data.length + 'E')});
            Antworten.push({letter: "F", message: newi18n.translate(value.lang, value.data.length + 'F')});
            res.status(200);
            res.json({
                frage: newi18n.translate(value.lang, value.data.length + 'Frage'),
                antworten: Antworten
            });
          }else{
            if(CountChar(value.data).length > 1){
              let CharArray = CountChar(value.data)

              for(i=0; i<= CharArray.length-1; i++){
                Antworten.push({letter: CharArray[i][0], message: newi18n.translate(value.lang, 'Weberin' + CharArray[i][0])})
              }
              res.status(200);
              res.json({
                  frage: newi18n.translate(value.lang, 'Weberin'),
                  antworten: Antworten
              });
            }else{
              let Turl = `http://twitter.com/intent/tweet?text=${encodeURIComponent(newi18n.translate(value.lang, "Web" + CountChar(value.data)[0][0]))}`
              res.status(200);
              res.json({
                  ergebniss: newi18n.translate(value.lang, CountChar(value.data)[0][0]),
                  buttonname: newi18n.translate(value.lang, "WebTwitter"),
                  tweetdata: Turl
              });
            }
          }
        }
    } catch (error) {
      next(error);
    }
  });

module.exports = {
    router,
    PluginName,
    PluginRequirements,
    PluginVersion,
    PluginAuthor,
    PluginDocs
  };