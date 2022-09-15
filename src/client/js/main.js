/* Kevin Pinto
 * CS241.011 Website Development
 * FinalProj
 */


document.addEventListener("DOMContentLoaded", function (event) {

  //Implementing a custom sticky navbar
  window.onscroll = function () {
    scrollFunction()
  };

  let navbar = document.getElementById("navbar");
  let buttons = navbar.getElementsByClassName("button");
  let sticky = navbar.offsetTop;

  // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function scrollFunction() {
    if (window.scrollY >= sticky) {
      navbar.classList.add("sticky")
    } else {
      navbar.classList.remove("sticky");
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  let search = document.getElementById("searchButton");
  let usernameInput = document.getElementById("username");


  search.addEventListener("click", function (event) {

    let someUsername = usernameInput.value;
    let url = new URL("http://localhost:8080");

    /** Reusable function to add the player querystring param */
    function appendParams(somePlayer, someUsername) {
      url.searchParams.append(somePlayer, someUsername);
    }


    let selected = document.querySelector('#player_select option:checked');
    let selected_value = selected.value;


    if (selected_value === "battle_history") {

      url = new URL("http://localhost:8080/battlehistory2");
      appendParams("player", someUsername);


      fetch(url.toString(), {
        method: "GET"
      }).then((response) => {
        if (response.status === 200) {

          response.json().then(response => {

            for (let battle of response) {

              console.log(JSON.stringify(battle));
            }

          });
        }

      }).catch(err => {
        console.error(err);
      });


      let resultsTable = document.getElementById("resultsTable");
      resultsTable.style.width = `auto`;
      resultsTable.setAttribute('border', '2');
      resultsTable.setAttribute('cellspacing', '2');
      resultsTable.setAttribute('cellpadding', '2');

      let player1Row = document.getElementById("player1_row");
      let player2Row = document.getElementById("player2_row");

      let thisCell = document.createElement("td");
      thisCell.innerHTML = "TEST";
      player2Row.appendChild(thisCell);


    }


    if (selected_value === "player_balances") {

      url = new URL("http://localhost:8080/playerBalances");
      appendParams("player", someUsername);

      /** Each 'series' array will contain all data points returned by the API as well as customizing the graph
       *  dynamically based on the data category. */
      let currencySeries = [];
      let cardPackSeries = [];
      let miscSeries = [];
      let seriesArray = [];

      fetch(url.toString(), {
        method: "GET"
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(responseData => {

            for (let resultArray of responseData) {
              for (let result of resultArray) {


                //delete player property for cleaner results
                // delete result.player;

                if (result.balance > 0) {

                  let token = result.token;

                  /**
                   * Reusable 'balance object' containing all the properties needed to build our color-coded charts.
                   *  */
                  let balObj = {
                    values: [result.balance],
                    text: result.token,
                    backgroundColor: '',
                    tooltip: {
                      backgroundColor: ''
                    },
                    legendItem: {
                      backgroundColor: ''
                    },
                    legendMarker: {
                      type: 'circle',
                      backgroundColor: '#fff',
                      borderColor: '',
                      borderWidth: '5px',
                      size: '8px'
                    },
                    legendText: '%t<br><b>%v</b>',
                    fontSize: '14',
                  }

                  /**
                   * Reusable function to set the colors on a particular 'balance object' for the background,
                   * tooltip background, legend item background, and the legend marker color.
                   * @param someBalObj 'balance object'
                   * @param someColor Color in hexadecimal form */
                  function setColor(someBalObj, someColor) {
                    someBalObj.backgroundColor = someColor;
                    someBalObj.tooltip.backgroundColor = someColor;
                    someBalObj.legendItem.backgroundColor = someColor;
                    someBalObj.legendMarker.borderColor = someColor;
                  }


                  //Color-code each result based on the token type and add it to the corresponding series array.
                  switch (token) {
                    case "VOUCHER":
                      setColor(balObj, '#5c31cb');
                      currencySeries.push(balObj);
                      break;
                    case "SPS":
                      setColor(balObj, '#6C3DF8');
                      currencySeries.push(balObj);
                      break;
                    case "DEC":
                      setColor(balObj, '#4c16f8');
                      /* PREVIOUS ITERATION
                      balObj.backgroundColor = '#F8B742';
                      balObj.tooltip.backgroundColor = '#F8B742';
                      balObj.legendItem.backgroundColor = '#F8B742';
                      balObj.legendMarker.borderColor = '#F8B742';*/
                      currencySeries.push(balObj);
                      break;
                    case "CREDITS":
                      setColor(balObj, '#a36fff');
                      currencySeries.push(balObj);
                      break;
                    case "SPSP":
                      setColor(balObj, '#351e72');

                      //Reusable functions allow text to be changed/added to the legend.
                      balObj.legendText = 'Staked SPS<br><b>%v</b>';
                      currencySeries.push(balObj);
                      break;


                    case "CHAOS":
                      setColor(balObj, '#1565C0');
                      cardPackSeries.push(balObj);
                      break;
                    case "SLDICE":
                      setColor(balObj, '#022bfa');
                      cardPackSeries.push(balObj);
                      break;
                    case "BETA":
                      setColor(balObj, '#08e7fc');
                      cardPackSeries.push(balObj);
                      break;
                    case "UNTAMED":
                      setColor(balObj, '#0aaef5');
                      cardPackSeries.push(balObj);
                      break;
                    case "ALPHA":
                      setColor(balObj, '#0307c9');
                      cardPackSeries.push(balObj);
                      break;


                    case "GOLD":
                      setColor(balObj, '#AD1457');
                      miscSeries.push(balObj);
                      break;
                    case "LEGENDARY":
                      setColor(balObj, '#ff00a6');
                      miscSeries.push(balObj);
                      break;
                    case "MERITS":
                      setColor(balObj, '#ff003f');
                      miscSeries.push(balObj);
                      break;
                    case "QUEST":
                      setColor(balObj, '#c9002e');
                      miscSeries.push(balObj);
                      break;

                    case "ECR":
                      break;

                    default:
                      console.log("Unknown token: " + token);
                      break;
                  }
                  seriesArray.push(balObj);
                }
              }
            }

            //console.log(seriesArray);
            //console.log(currencySeries);

            /**
             * chartConfig is the base configuration for the chart, it serves as a prototype for the drill-down
             * charts, and the landing when the back button is clicked.
             * */
            let chartConfig = {
              type: 'pie',
              id: 'baseline',
              title: {
                text: 'Account Balance for: ' + responseData[0][0].player,
                align: 'center',
              },
              legend: {
                text: '%t<br>',
                borderWidth: '0px',
                header: {
                  text: 'Token Type',
                  align: 'center',
                  bold: true,
                  fontColor: '#110000',
                  fontSize: '16px'
                },
                item: {
                  align: 'center',
                  padding: '10px',
                  borderRadius: '3px',
                  fontColor: '#ffffff',
                  width: '120px'
                },
                itemOff: {
                  alpha: 0.7,
                  fontColor: '#616161',
                  lineWidth: '2px',
                  textAlpha: 1,
                  textDecoration: 'line-through'
                },
                markerOff: {
                  alpha: 0.2
                },
                toggleAction: 'remove',
                verticalAlign: 'middle',
                width: '140px'
              },
              subtitle: {
                text: 'Click any slice for a more detailed view of token balances!',
                align: 'center',
                size: '18px',
              },
              plot: {
                dataPlayer: someUsername,
                valueBox: {
                  decimals: 2,
                  placement: 'out',
                },
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_BACK_EASE_OUT',
                  onLegendToggle: false,
                  sequence: 'ANIMATION_BY_PLOT'
                },
                decimals: 2,
                detach: false,
                refAngle: 270,
                thousandsSeparator: ','
              },
              tooltip: {
                text: '%t: <br>%npv%',
                bold: true,
                borderRadius: '5',
                fontColor: '#ffffff',
              },
              series: [
                {
                  text: 'Currency Tokens',
                  values: [currencySeries.length],
                  dataId: 'currency',
                  backgroundColor: '#4527A0',
                  tooltip: {
                    backgroundColor: '#4527A0'
                  },
                  legendItem: {
                    backgroundColor: '#4527A0'
                  },
                  legendMarker: {
                    type: 'circle',
                    backgroundColor: '#fff',
                    borderColor: '#4527A0',
                    borderWidth: '4px',
                    size: '7px'
                  },
                  legendText: '%t<br><b>%v</b>'
                },
                {
                  text: 'Card Packs',
                  values: [cardPackSeries.length],
                  dataId: 'cardPack',
                  backgroundColor: '#1565C0',
                  legendItem: {
                    backgroundColor: '#1565C0'
                  },
                  legendMarker: {
                    type: 'circle',
                    backgroundColor: '#fff',
                    borderColor: '#1565C0',
                    borderWidth: '4px',
                    size: '7px'
                  },
                  legendText: '%t<br><b>%v</b>'
                },
                {
                  text: 'Potions, Guild, Misc',
                  values: [miscSeries.length],
                  dataId: 'misc',
                  backgroundColor: '#AD1457',
                  legendItem: {
                    backgroundColor: '#AD1457'
                  },
                  legendMarker: {
                    type: 'circle',
                    backgroundColor: '#fff',
                    borderColor: '#AD1457',
                    borderWidth: '4px',
                    size: '7px'
                  },
                  legendText: '%t<br><b>%v</b>'
                }
              ],

              //Custom back button for the charts using a triangle and some creative styling.
              shapes: [
                {
                  'x': 25,
                  'y': 25,
                  'size': 12,
                  'angle': -90,
                  'type': 'triangle',
                  'background-color': '#C4C4C4',
                  'padding': 5,
                  'cursor': 'hand',
                  'id': 'backwards',
                  'hover-state': {
                    'border-width': 2,
                    'border-color': '#fd0000'
                  }
                }
              ]
            }//chartConfig


            //Render the base chart.
            zingchart.render({
              id: 'myChart',
              data: chartConfig,

            });

            //Create the drill-down charts using the base as a prototype.
            let currencyChart = {
              type: "pie",
              title: {
                text: "Currency Token Balances",
                align: "center",
              },
              legend: {
                text: '%t<br>',
                borderWidth: '0px',
                header: {
                  text: 'Currency Tokens',
                  align: 'center',
                  bold: true,
                  fontColor: '#110000',
                  fontSize: '16px'
                },
                item: {
                  align: 'center',
                  padding: '10px',
                  borderRadius: '3px',
                  fontColor: '#ffffff',
                  width: '115px'
                },
                itemOff: {
                  alpha: 0.7,
                  fontColor: '#616161',
                  lineWidth: '2px',
                  textAlpha: 1,
                  textDecoration: 'line-through'
                },
                markerOff: {
                  alpha: 0.2
                },
                toggleAction: 'remove',
                verticalAlign: 'middle',
                width: '140px'
              },
              plot: {
                valueBox: {
                  decimals: 2,
                  placement: 'out',
                },
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_BACK_EASE_OUT',
                  onLegendToggle: false,
                  sequence: 'ANIMATION_BY_PLOT'
                },
                decimals: 2,
                detach: true,
                refAngle: 270,
                thousandsSeparator: ','
              },
              tooltip: {
                text: '%t: <br>%npv%',
                bold: true,
                borderRadius: '5',
                fontColor: '#ffffff',
              },
              series: currencySeries,
              shapes: [
                {
                  'x': 25,
                  'y': 25,
                  'size': 12,
                  'angle': -90,
                  'type': 'triangle',
                  'background-color': '#C4C4C4',
                  'padding': 5,
                  'cursor': 'hand',
                  'id': 'backwards',
                  'hover-state': {
                    'border-width': 2,
                    'border-color': '#ff0000'
                  }
                }
              ]
            }


            let cardPackChart = {
              type: "pie",
              title: {
                text: "Card Packs Balance",
                align: "center",
              },
              legend: {
                text: '%t<br>',
                borderWidth: '0px',
                header: {
                  text: 'Card Packs',
                  align: 'center',
                  bold: true,
                  fontColor: '#110000',
                  fontSize: '16px'
                },
                item: {
                  align: 'center',
                  padding: '10px',
                  borderRadius: '3px',
                  fontColor: '#ffffff',
                  width: '115px'
                },
                itemOff: {
                  alpha: 0.7,
                  fontColor: '#616161',
                  lineWidth: '2px',
                  textAlpha: 1,
                  textDecoration: 'line-through'
                },
                markerOff: {
                  alpha: 0.2
                },
                toggleAction: 'remove',
                verticalAlign: 'middle',
                width: '140px'
              },
              plot: {
                valueBox: {
                  decimals: 2,
                  placement: 'out',
                },
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_BACK_EASE_OUT',
                  onLegendToggle: false,
                  sequence: 'ANIMATION_BY_PLOT'
                },
                decimals: 2,
                detach: true,
                refAngle: 270,
                thousandsSeparator: ','
              },
              tooltip: {
                text: '%t: <br>%npv%',
                bold: true,
                borderRadius: '5',
                fontColor: '#ffffff',
              },
              series: cardPackSeries,
              shapes: [
                {
                  'x': 25,
                  'y': 25,
                  'size': 12,
                  'angle': -90,
                  'type': 'triangle',
                  'background-color': '#C4C4C4',
                  'padding': 5,
                  'cursor': 'hand',
                  'id': 'backwards',
                  'hover-state': {
                    'border-width': 2,
                    'border-color': '#ff0000'
                  }
                }
              ]
            }


            let miscChart = {
              type: "pie",
              title: {
                text: "Potion, Guild, Misc Token Balances",
                align: "center",
              },
              legend: {
                text: '%t<br>',
                borderWidth: '0px',
                header: {
                  text: 'Token Name',
                  align: 'center',
                  bold: true,
                  fontColor: '#110000',
                  fontSize: '16px'
                },
                item: {
                  align: 'center',
                  padding: '10px',
                  borderRadius: '3px',
                  fontColor: '#ffffff',
                  width: '120px'
                },
                itemOff: {
                  alpha: 0.7,
                  fontColor: '#616161',
                  lineWidth: '2px',
                  textAlpha: 1,
                  textDecoration: 'line-through'
                },
                markerOff: {
                  alpha: 0.2
                },
                toggleAction: 'remove',
                verticalAlign: 'middle',
                width: '140px'
              },
              plot: {
                valueBox: {
                  decimals: 2,
                  placement: 'out',
                },
                animation: {
                  effect: 'ANIMATION_EXPAND_VERTICAL',
                  method: 'ANIMATION_BACK_EASE_OUT',
                  onLegendToggle: false,
                  sequence: 'ANIMATION_BY_PLOT'
                },
                decimals: 2,
                detach: true,
                refAngle: 270,
                thousandsSeparator: ','
              },
              tooltip: {
                text: '%t: <br>%npv%',
                bold: true,
                borderRadius: '5',
                fontColor: '#ffffff',
              },
              series: miscSeries,
              shapes: [
                {
                  'x': 25,
                  'y': 25,
                  'size': 12,
                  'angle': -90,
                  'type': 'triangle',
                  'background-color': '#C4C4C4',
                  'padding': 5,
                  'cursor': 'hand',
                  'id': 'backwards',
                  'hover-state': {
                    'border-width': 2,
                    'border-color': '#ff0000'
                  }
                }
              ]
            }


            /*
            INITIAL IMPLEMENTATION OF DRILL-DOWN CHARTS
            This method is not used anymore, but is kept here for reference. It utilized the zingchart API
             'setseriesdata' method and
             associative arrays to display the drill-down charts.

            let drillDownDataStructure = [];
            drillDownDataStructure["currency"] = {
              series: currencySeries,
              backgroundColor: '#4527A0'
            };
            drillDownDataStructure["cardPack"] = {
              series: cardPackSeries,
              backgroundColor: '#1565C0',
            };
            drillDownDataStructure["misc"] = {
              series: miscSeries,
              backgroundColor: '#AD1457',
            }
            */


            /**
             * Using the node_click function as the equivalent of HTML event listeners for drill-down functionality. */
            zingchart.node_click = function (p) {

              /*var plotIndex = p.plotindex;
              var scaleText = p.scaletext;*/


              console.log(p);

              /*let clickedSlice = drillDownDataStructure[p['data-id']];
                            console.log("clickedSlice: " + JSON.stringify(clickedSlice));*/


              /**
               * Depending on the slice/node clicked by the user the corresponding drilldown chart is displayed
               */

              let clickedSliceData = (p['data-id']);
              console.log("clickedSliceData: " + clickedSliceData);


              switch (clickedSliceData) {
                case "currency":
                  zingchart.exec('myChart', 'setdata', {
                    data: currencyChart,
                  });
                  break;
                case "cardPack":
                  zingchart.exec('myChart', 'setdata', {
                    data: cardPackChart,
                  });
                  break;
                case "misc":
                  zingchart.exec('myChart', 'setdata', {
                    data: miscChart,
                  });
                  break;

              }


              /* PREVIOUS IMPLEMENTATIONS OF DRILL-DOWN FUNCTIONALITY FOR REFERENCE
              zingchart.exec('myChart', 'setseriesdata', {
              data: drillDownDataStructure[p['data-id']].series,
            });

              if (drillDownDataStructure[p['data-id']]){
               if (p['data-id'] === 'currency') {

              zingchart.render({
                id: 'myChart', data: currencyChart,
              });
              }
              }*/

            }

            //Implement the back button functionality.
            zingchart.shape_click = function (p) {
              const shapeId = p.shapeid;
              //console.log(p);

              switch (shapeId) {
                case 'backwards':
                  zingchart.exec('myChart', 'setdata', {
                    data: chartConfig,
                  });
                  break;
                case 'default':
                  console.error("This should never happen!");
                  break;
              }
            }


            let myConfig = {
              type: 'pie', title: {
                text: 'Account Balances', fontSize: 24,
              }, legend: {
                draggable: true,
              }, plot: {
                'value-box': {
                  text: "%t %v\n%npv%", 'font-size': 14, 'font-family': "Georgia", 'font-weight': "normal",
                  rules: [
                    {
                      rule: "%v > 100", placement: "in", 'font-color': "white",
                    }, {
                      rule: "%v <= 100", placement: "out", 'font-color': "gray",
                    }
                  ]
                }
              }, series: seriesArray
            };



          });
        }

      }).catch(err => {
        console.error(err);
      });
    }//end of player_balances selection


    if (selected_value === "current_quest") {

      url = new URL("http://localhost:8080/currentQuest");
      appendParams("player", someUsername);

      fetch(url.toString(), {
        method: "GET"
      }).then((response) => {

        if (response.status === 200) {
          response.json().then(responseData => {
            // console.log(responseData);
            return responseData;
          });
        }


      }).catch(err => {
        console.error(err);
      });

    }


    if (selected_value === "account_details") {

      url = new URL("http://localhost:8080/accountDetails");
      appendParams("player", someUsername);


      fetch(url.toString(), {
        method: "GET"
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(responseData => {

          }).catch(err => {
            console.error(err);
          })
        }
      })

    }


    if (selected_value === "referrals") {

      url = new URL("http://localhost:8080/accountReferrals");
      appendParams("player", someUsername);

      fetch(url.toString()).then((response) => {
        if (response.status === 200) {
          response.json().then(responseData => {

          }).catch(err => {
            console.error(err);
          })
        }
      })

    }

  })


});//DOMContentLoaded