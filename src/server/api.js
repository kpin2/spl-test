import express from 'express';
import axios from "axios";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


let router = express.Router();

//global-scope array to hold endpoint responses
let results = [];
let player = "";

/**
 * reusable function to clear results array before calling next endpoint
 * @param resultsArray array of endpoint responses */
function clearResults(resultsArray) {
  if (resultsArray.length > 0) {
    results = [];
  }
  return resultsArray;
}


//implementing SwaggerUI for API docs
const options = {
  definition: {
    openapi: '3.0.0', info: {
      title: 'Splinter-Masters API',
      description: 'This API was designed for use with the Splinter-Masters application. It provides access to the' + ' official Splinterlands API through custom endpoints. Note that not all of the official Splinterlands' + ' endpoints' + ' are used/listed here.',
      version: '1.0.1',
      contact: 'kpinto2@massbay.edu',
    },
  }, apis: ['./api.js'],
};
const swaggerSpec = swaggerJsDoc(options);
router.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Player
 *     description: Operations for retrieving information about a players' account
 *   - name: Battles
 *     description: Operations for retrieving battle information, battle history, etc
 *   - name: Cards
 *     description: Operations for retrieving card information, images, etc
 *   - name: Market
 *     description: Operations for retrieving market information, listings, transactions, etc
 *   - name: Purchases
 *     description: Operations for retrieving purchase information, settings, etc
 * */


/**
 * Reusable function to check a valid 'player' value has been entered, defaulting to 'itsthebean' if not.
 * @param somePlayer string containing the name of a player/Hive account
 * */
function validatePlayer(somePlayer) {
  if ((somePlayer === undefined) || (somePlayer === "")) {
    player = "itsthebean";
  } else {
    player = somePlayer;
  }
  return player;
}


/**
 Reusable axios instances with the baseURLs defined
 */
const modernUrlInstance = axios.create({
  baseURL: 'https://api2.splinterlands.com'
});
const legacyUrlInstance = axios.create({
  baseURL: 'https://api.steemmonsters.io'
});


/**
 * Provides a simple, reusable, async method to call endpoints using the modern API URL.
 *
 * @param someEndpoint specific endpoint URL relative to modern API
 * @return results array to capture and return the response from each endpoint
 * */
async function getEndpointModernUrl(someEndpoint) {
  try {
    const response = await modernUrlInstance.get(someEndpoint);
    results.push(response.data);
  } catch (e) {
    console.error(e);
  }
  console.log(results);
  return results;
}

/**
 * Provides a simple, reusable, async method to call endpoints using the legacy API URL.
 *
 * @param someEndpoint specific endpoint URL relative to legacy API
 * @return results array to capture and return the response from each endpoint
 * */
async function getEndpointLegacyUrl(someEndpoint) {
  try {
    const response = await legacyUrlInstance.get(someEndpoint);
    results.push(response.data);
  } catch (e) {
    console.error(e);
  }
  //console.log(results);
  return results;
}


/* Battle related endpoints */
//https://api2.splinterlands.com/battle/history?player=itsthebean
let battleHistory1Endpoint = '/battle/history?player=';

//https://api2.splinterlands.com/battle/history2?player=itsthebean
let battleHistory2Endpoint = '/battle/history2?player=';

//https://api.steemmonsters.io/players/history?username=itsthebean
let battleHistory3Endpoint = '/players/history?username=';


//TODO
/* specificBattleById */
//https://api2.splinterlands.com/battle/result?id=
let specificBattleById = '/battle/result?id=';

/* Player related endpoints */
//https://api2.splinterlands.com/players/balances?username=itsthebean
let balancesEndpoint = '/players/balances?username=';

//https://api2.splinterlands.com/players/quests?username=itsthebean
let questEndpoint = '/players/quests?username=';

//https://api2.splinterlands.com/players/referrals?username=itsthebean
let referralsEndpoint = '/players/referrals?username=';

//https://api2.splinterlands.com/players/details?name=itsthebean
let accountDetailsEndpoint = '/players/details?name=';

//TODO
/* cardPacksPurchasedEndpoint */
//https://api2.splinterlands.com/players/pack_purchases?edition=5&username;=itsthebean
let cardPacksPurchasedEndpoint = '/players/pack_purchases'

/* Card related endpoints */
//https://api2.splinterlands.com/cards/collection/itsthebean
let cardCollectionEndpoint = '/cards/collection/';

//https://api2.splinterlands.com/cards/find?ids=G3-250-4FDC3NVMTC
let cardByIdEndpoint = '/cards/find?ids=';

//take no params but return large data sets
//https://api2.splinterlands.com/cards/stats
let cardsGlobalStatsEndpoint = '/cards/stats';

//https://api2.splinterlands.com/cards/get_details
let cardsGlobalDetailsEndpoint = '/cards/get_details';


//TODO
/* Market related endpoints */
//https://api2.splinterlands.com/market/volume
let marketVolumeEndpoint = '/market/volume';

//TODO
/* marketHistoryByPlayerEndpoint */
//https://api2.splinterlands.com/market/history?player=itsthebean
let marketHistoryByPlayerEndpoint = '/market/history?player=';

/* Purchase related endpoints */

//TODO
/* cardPackStatsEndpoint */
//https://api2.splinterlands.com/purchases/stats
let cardPackStatsEndpoint = '/purchases/stats';

//TODO
/* transactionHistoryEndpoint */
//https://api.steemmonsters.io/players/history?username=itsthebean
let transactionHistoryEndpoint = '/players/history?username='

//TODO
/* purchaseSettingsEndpoint */
//https://api2.splinterlands.com/purchases/settings
let purchaseSettingsEndpoint = '/purchases/settings'


/**
 * @swagger
 * components:
 *   schemas:
 *     Balance:
 *       type: object
 *       properties:
 *         player:
 *           type: string
 *         token:
 *           type: string
 *         balance:
 *           type: number
 *           format: double
 *     Card:
 *       type: object
 *       properties:
 *         player:
 *           type: string
 *         uid:
 *           type: string
 *         card_detail_id:
 *           type: integer
 *           format: int32
 *         xp:
 *           type: integer
 *           format: int32
 *         gold:
 *           type: boolean
 *         edition:
 *           type: integer
 *           format: int32
 *         level:
 *           type: integer
 *           format: int32
 *     Battle:
 *       type: object
 *       properties:
 *         player_1:
 *           type: string
 *         player_2:
 *           type: string
 *         created_date:
 *           type: string
 *           format: date-time
 *         match_type:
 *           type: string
 *         mana_cap:
 *           type: integer
 *           format: int32
 *         winner:
 *           type: string
 *         current_streak:
 *           type: integer
 *           format: int32
 *         ruleset:
 *           type: string
 *         player_1_rating_initial:
 *           type: integer
 *           format: int32
 *         player_2_rating_initial:
 *           type: integer
 *           format: int32
 *         player_1_rating_final:
 *           type: integer
 *           format: int32
 *         details:
 *           type: object
 *           properties:
 *             team1:
 *               type: object
 *               properties:
 *                 player:
 *                   type: string
 *                 rating:
 *                   type: integer
 *                   format: int32
 *                 color:
 *                   type: string
 *                 summoner:
 *                   schema:
 *                     $ref: '#/components/schemas/Card'
 *                 monsters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Card'
 *     Quest:
 *       type: object
 *       properties:
 *         player:
 *           type: string
 *         created_date:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         total_items:
 *           type: integer
 *           format: int32
 *         completed_items:
 *           type: integer
 *           format: int32
 *     Referral:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         join_date:
 *           type: string
 *           format: date-time
 *         starter_pack_purchase:
 *           type: boolean
 *         rating:
 *           type: integer
 *           format: int32
 *         battles:
 *           type: integer
 *           format: int32
 *         avatar_id:
 *           type: integer
 *           format: int32
 *         display_name:
 *           type: string
 *         title_pre:
 *           type: string
 *         title_post:
 *           type: string
 *         league:
 *           type: integer
 *           format: int32
 *     Purchase:
 *       type: object
 *       properties:
 *         purchase_type:
 *           type: string
 *         affiliate:
 *           type: string
 *         purchaser:
 *           type: string
 *         created_date:
 *           type: string
 *           format: date-time
 *         purchase_amount_USD:
 *           type: integer
 *           format: int32
 *         affiliate_payment:
 *           type: string
 *         player_data:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             join_date:
 *               type: string
 *               format: date-time
 *             rating:
 *               type: integer
 *               format: int32
 *             battles:
 *               type: integer
 *               format: int32
 *             wins:
 *               type: integer
 *               format: int32
 *             current_streak:
 *               type: integer
 *               format: int32
 *             longest_streak:
 *               type: integer
 *               format: int32
 *             max_rating:
 *               type: integer
 *               format: int32
 *             max_rank:
 *               type: integer
 *               format: int32
 *             champion_points:
 *               type: integer
 *               format: int32
 *             capture_rate:
 *               type: integer
 *               format: int32
 *             last_reward_block:
 *               type: integer
 *               format: int32
 *             last_reward_time:
 *               type: integer
 *               format: int32
 *             guild:
 *               type: string
 *             guild_name:
 *               type: string
 *             guild_motto:
 *               type: string
 *             guild_data:
 *               type: string
 *             guild_level:
 *               type: string
 *             guild_quest_lodge_level:
 *               type: integer
 *               format: int32
 *             starter_pack_purchase:
 *               type: boolean
 *             avatar_id:
 *               type: integer
 *               format: int32
 *             display_name:
 *               type: string
 *             title_pre:
 *               type: string
 *             title_post:
 *               type: string
 *             collection_power:
 *               type: integer
 *               format: int32
 *             league:
 *               type: integer
 *               format: int32
 *             adv_msg_sent:
 *               type: boolean
 *             alt_name:
 *               type: string
 *     CardStats:
 *       type: object
 *       properties:
 *         card_detail_id:
 *           type: integer
 *           format: int32
 *         gold:
 *           type: boolean
 *         edition:
 *           type: integer
 *           format: int32
 *         num_cards:
 *           type: integer
 *           format: int32
 *         total_xp:
 *           type: integer
 *           format: int32
 *         num_burned:
 *           type: integer
 *           format: int32
 *         total_burned_xp:
 *           type: integer
 *           format: int32
 *     AccountDetails:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         join_date:
 *           type: string
 *           format: date-time
 *         rating:
 *           type: integer
 *           format: int32
 *         battles:
 *           type: integer
 *           format: int32
 *         wins:
 *           type: integer
 *           format: int32
 *         current_streak:
 *           type: integer
 *           format: int32
 *         longest_streak:
 *           type: integer
 *           format: int32
 *         max_rating:
 *           type: integer
 *           format: int32
 *         max_rank:
 *           type: integer
 *           format: int32
 *         champion_points:
 *           type: integer
 *           format: int32
 *         capture_rate:
 *           type: integer
 *           format: int32
 *         last_reward_block:
 *           type: integer
 *           format: int32
 *         guild:
 *           type: string
 *         starter_pack_purchase:
 *           type: boolean
 *         avatar_id:
 *           type: integer
 *           format: int32
 *         display_name:
 *           type: string
 *         title_pre:
 *           type: string
 *         title_post:
 *           type: string
 *         collection_power:
 *           type: integer
 *           format: int32
 *         league:
 *           type: integer
 *           format: int32
 *         adv_msg_sent:
 *           type: boolean
 *         is_banned:
 *           type: boolean
 *         modern_rating:
 *           type: integer
 *           format: int32
 *         modern_battles:
 *           type: integer
 *           format: int32
 *         modern_wins:
 *           type: integer
 *           format: int32
 *         modern_current_streak:
 *           type: integer
 *           format: int32
 *         modern_longest_streak:
 *           type: integer
 *           format: int32
 *         modern_max_rating:
 *           type: integer
 *           format: int32
 *         modern_max_rank:
 *           type: integer
 *           format: int32
 *         modern_league:
 *           type: integer
 *           format: int32
 *         modern_adv_msg_sent:
 *           type: boolean
 *         paypal_ban:
 *           type: boolean
 *
 * */


/**
 * @swagger
 * /battleHistory1:
 *   get:
 *     summary: 'Finds the players 50 most recent battles.
 *       Splinterlands API: https://api2.splinterlands.com/battle/history'
 *     tags: [Battles]
 *     parameters:
 *       - in: query
 *         name: player
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *         example: 'itsthebean'
 *     responses:
 *       200:
 *         description: A successful call returns an array of battle objects for the supplied player name, up to 50
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battle'
 * */
router.get('/battleHistory1', async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(battleHistory1Endpoint + player);

  res.json(results);

})


/**
 * @swagger
 * /battleHistory2:
 *   get:
 *     summary: 'Finds the players 20 most recent battles.
 *       Splinterlands API: https://api2.splinterlands.com/battle/history2'
 *     tags: [Battles]
 *     parameters:
 *       - in: query
 *         name: player
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *         example: 'itsthebean'
 *     responses:
 *       default:
 *         description: A successful call returns an array of battle objects for the supplied player name, up to 20
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battle'
 * */
router.get('/battleHistory2', async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(battleHistory2Endpoint + player);

  // console.log(results);

  for (let battle of results) {
    console.log(battle);
  }

  res.json(results);
});


/**
 * @swagger
 * /battleHistory3:
 *   get:
 *     summary: 'Finds data on any transactions, including battles, in the last 30 days.
 *       Splinterlands API: https://api.steemmonsters.io/players/history'
 *     tags: [Battles, Purchases]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *         example: 'itsthebean'
 *     responses:
 *       default:
 *         description: Returns an array of Battle and Purchase objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battle'
 */
router.get('/battleHistory3', async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointLegacyUrl(battleHistory3Endpoint + player);

  res.json(results);
});


/**
 * @swagger
 * /playerBalances:
 *   get:
 *     summary: "Finds players' balance for each tokenized asset in the game, including card packs, DEC, SPS, and
 *       potions.
 *       Splinterlands API: https://api2.splinterlands.com/players/balances"
 *     tags: [Player]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *         example: 'itsthebean'
 *     responses:
 *       default:
 *         description: Returns an array of Balance objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Balance'
 * */
router.get('/playerBalances', async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(balancesEndpoint + player);

  res.json(results);
});


/**
 * @swagger
 * /currentQuest:
 *   get:
 *     summary: 'Finds players current quest.
 *       Splinterlands API: https://api2.splinterlands.com/players/quests'
 *     tags: [Player]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *         example: 'itsthebean'
 *     responses:
 *       default:
 *         description: Returns an array containing a Quest object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 * */
router.get('/currentQuest', async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(questEndpoint + player);

  res.json(results);
});


/** @swagger
 * /accountDetails:
 *   get:
 *     summary: 'Finds various details about the player account.
 *       Splinterlands API: https://api2.splinterlands.com/players/details'
 *     tags: [Player]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array containing an object with account details
 *         content:
 *           application/json:
 *             examples:
 *               example:
 *                 summary: Example account details object
 *                 externalValue: 'https://api2.splinterlands.com/players/details?name=itsthebean'
 * */
router.get("/accountDetails", async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(accountDetailsEndpoint + player);


  res.json(results);
});


/**
 * @swagger
 * /accountReferrals:
 *   get:
 *     summary: Finds any referrals made by the player account
 *     tags: [Player]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array containing a Referral object and an array of Purchase objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referral'
 *
 * */
router.get("/accountReferrals", async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(referralsEndpoint + player);

  res.json(results);
})


/**
 * @swagger
 * /cardCollection:
 *   get:
 *     summary: Finds any cards in the players' collection
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Players' username/Hive account name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array of Card objects owned by the player
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *
 * */
router.get("/cardCollection", async (req, res) => {

  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(cardCollectionEndpoint + player);

  res.json(results);
})


/**
 * @swagger
 * /cardsById:
 *   get:
 *     summary: Finds cards by their unique uID number
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: uID
 *         description: Unique card ID
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array of Cards with matching uID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *
 * */
router.get('/cardsById', async (req, res) => {
  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(cardByIdEndpoint);
  res.json(results);
});


/**
 * @swagger
 * /cardGlobalStats:
 *   get:
 *     summary: Lists global statistics about each card
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: uID
 *         description: Unique card ID
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array of information on each card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *
 * */
router.get('/cardGlobalStats', async (req, res) => {
  validatePlayer(req.query.player);
  clearResults(results);
  await getEndpointModernUrl(cardsGlobalStatsEndpoint);
  res.json(results);
});


/**
 * @swagger
 * /cardGlobalStats:
 *   get:
 *     summary: Lists global statistics about each card
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: uID
 *         description: Unique card ID
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       default:
 *         description: Returns an array of information on each card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *
 * */
router.get('/cardGlobalDetails', async (req, res) => {
  validatePlayer(req.query.player);
  clearResults(results);

  await getEndpointModernUrl(cardsGlobalDetailsEndpoint);
  res.json(results);
});

export default router;