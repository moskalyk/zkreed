import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerHelloWorld,
  sayHello,
  getRelayTime,
  tellFortune, } from './_aqua/getting-started';

const relayNodes = [krasnodar[4], krasnodar[5], krasnodar[6]];

function rangeSlider () {
  const el = document.createElement('div')
  el.classList.add('container')
  const shadow = el.attachShadow({ mode: 'open'})

  const input = document.createElement('input')
  input.id = 'cd'
  input.type = 'range'
  input.max="200"
  input.min="5"
  input.step="1"
  // input.onchange = showVal(this.value)

  const style = document.createElement('style')
  style.textContent = get_theme() 

  shadow.append(style, input)
  return el
}

function get_theme () {
  return `
    :host(.container) {
    }
    input {
      width: 20%;
      transform: rotate(270deg);
      margin-left: -100px;
    }
  `
}
let deck = {
  0: 'https://www.trustedtarot.com/img/cards/the-fool.png',
  1: 'https://www.trustedtarot.com/img/cards/the-magician.png',
  2: 'https://www.trustedtarot.com/img/cards/the-high-priestess.png',
  3: 'https://www.trustedtarot.com/img/cards/the-empress.png',
  4: 'https://www.trustedtarot.com/img/cards/the-emperor.png',
  5:'https://www.trustedtarot.com/img/cards/the-heirophant.png',
  6:'https://www.trustedtarot.com/img/cards/the-lovers.png',
  7:'https://www.trustedtarot.com/img/cards/the-chariot.png',
  8:'https://www.trustedtarot.com/img/cards/strength.png',
  9:'https://www.trustedtarot.com/img/cards/the-hermit.png',
  10:'https://www.trustedtarot.com/img/cards/wheel-of-fortune.png',
  11:'https://www.trustedtarot.com/img/cards/justice.png',
  12:'https://www.trustedtarot.com/img/cards/the-hanged-man.png'
}

// import {
//   registerHelloWorld,
//   sayHello,
//   getRelayTime,
//   tellFortune,
// } from "./_aqua/hello-world"; // (2)
let count = 0;

function Oracle() {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [helloMessage, setHelloMessage] = useState<string | null>(null);

    const [peerIdInput, setPeerIdInput] = useState<string>('');
    const [relayPeerIdInput, setRelayPeerIdInput] = useState<string>('');

    const connect = async (relayPeerId: string) => {
        try {
            await Fluence.start({ connectTo: relayPeerId });
            setIsConnected(true);
            // Register handler for this call in aqua:
            // HelloPeer.hello(%init_peer_id%)

            registerHelloWorld({
                hello: (str: any) => {
                  console.log(str);
                },
                getFortune: async () => {
                  await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                  });
                  return "Wealth awaits you very soon.";
                },
              });

            // registerHelloPeer({
            //     hello: (from) => {
            //         setHelloMessage('Hello from: \n' + from);
            //         return 'Hello back to you, \n' + from;
            //     },
            // });
        } catch (err) {
            console.log('Peer initialization failed', err);
        }
    };

    const helloBtnOnClick = async () => {
        if (!Fluence.getStatus().isConnected) {
            return;
        }

        // console.log(await sayHello()); // (4)

        // console.log(await tellFortune()); // (6)

        const relayTime = await getRelayTime();

        // console.log(`The relay time is: ${relayTime}`);
        console.log(Math.floor([...Array(relayTime % 78).keys()].reduce((x,y) => x + Math.abs(Math.tan(y)))%78))

        // Using aqua is as easy as calling a javascript funсtion
        // const res = await sayHello(peerIdInput, relayPeerIdInput);
        // setHelloMessage(res);
    };

    return (
        <div className="App">
            <header>
                <img src={logo} className="logo" alt="logo" />
            </header>

            <div className="content">
                {isConnected ? (
                    <>
                        <h1>Connected</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="bold">Peer id:</td>
                                    <td className="mono">
                                        <span id="peerId">{Fluence.getStatus().peerId!}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-clipboard"
                                            onClick={() => copyToClipboard(Fluence.getStatus().peerId!)}
                                        >
                                            <i className="gg-clipboard"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="bold">Relay peer id:</td>
                                    <td className="mono">
                                        <span id="relayId">{Fluence.getStatus().relayPeerId}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-clipboard"
                                            onClick={() => copyToClipboard(Fluence.getStatus().relayPeerId!)}
                                        >
                                            <i className="gg-clipboard"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div>
                            <h2>Say hello!</h2>
                            <p className="p">
                                Now try opening a new tab with the same application. Copy paste the peer id and relay
                                from the second tab and say hello!
                            </p>
                            <div className="row">
                                <label className="label bold">Target peer id</label>
                                <input
                                    id="targetPeerId"
                                    className="input"
                                    type="text"
                                    onChange={(e) => setPeerIdInput(e.target.value)}
                                    value={peerIdInput}
                                />
                            </div>
                            <div className="row">
                                <label className="label bold">Target relay</label>
                                <input
                                    id="targetRelayId"
                                    className="input"
                                    type="text"
                                    onChange={(e) => setRelayPeerIdInput(e.target.value)}
                                    value={relayPeerIdInput}
                                />
                            </div>
                            <div className="row">
                                <button className="btn btn-hello" onClick={helloBtnOnClick}>
                                    say hello
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Intro 1: P2P browser-to-browser</h1>
                        <h2>Pick a relay</h2>
                        <ul>
                            {relayNodes.map((x) => (
                                <li key={x.peerId}>
                                    <span className="mono">{x.peerId}</span>
                                    <button className="btn" onClick={() => connect(x.multiaddr)}>
                                        Connect
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {helloMessage && (
                    <>
                        <h2>Message</h2>
                        <div id="message"> {helloMessage} </div>
                    </>
                )}
            </div>
        </div>
    );
}

function Spread() {
  // const [play] = useSound(cardFX);
  const [card1, card1Set]= useState<string>('');
  const [card2, card2Set]= useState<string>('');
  const [card3, card3Set]= useState<string>('');

  // const [peerIdInput, setPeerIdInput] = useState('');
  // const [relayPeerIdInput, setRelayPeerIdInput] = useState('');

  // const connect = async (relayPeerId) => {
  //     try {
  //         await Fluence.start({ connectTo: relayPeerId });
  //         setIsConnected(true);
  //         // Register handler for this call in aqua:
  //         // HelloPeer.hello(%init_peer_id%)

  //         registerHelloWorld({
  //             hello: (str) => {
  //               console.log(str);
  //             },
  //             getFortune: async () => {
  //               await new Promise((resolve) => {
  //                 setTimeout(resolve, 1000);
  //               });
  //               return "Wealth awaits you very soon.";
  //             },
  //           });

  //         // registerHelloPeer({
  //         //     hello: (from) => {
  //         //         setHelloMessage('Hello from: \n' + from);
  //         //         return 'Hello back to you, \n' + from;
  //         //     },
  //         // });
  //     } catch (err) {
  //         console.log('Peer initialization failed', err);
  //     }
  // };

  //   const helloBtnOnClick = async () => {
  //       if (!Fluence.getStatus().isConnected) {
  //           return;
  //       }

  //       // console.log(await sayHello()); // (4)

  //       // console.log(await tellFortune()); // (6)

  //       const relayTime = await getRelayTime();

  //       // console.log(`The relay time is: ${relayTime}`);
  //       console.log(Math.floor([...Array(relayTime % 78).keys()].reduce((x,y) => x + Math.abs(Math.tan(y)))%78))

  //       // Using aqua is as easy as calling a javascript funсtion
  //       // const res = await sayHello(peerIdInput, relayPeerIdInput);
  //       // setHelloMessage(res);
  //   };

  const [init, setInit] = useState(false)
  useEffect(() => {

    // if(!init){
      const range = rangeSlider()
      document.body.append(range)
      setInit(true);
      

      try {
        (document.getElementsByClassName('container')[1] as HTMLElement).remove()
      } catch(e){
          console.log(e)
      }
        // (document.getElementsByClassName('container') as HTMLCollectionOf<HTMLElement>)[0].style.paddingLeft = '589px'
        // (document.getElementsByClassName('container')[0] as HTMLElement).shadowRoot.getElementById('cd').style.marginTop = '-200px'

        // const el = 
        // (document.getElementsByClassName('container')[0] as HTMLElement)).shadowRoot.getElementById('cd')
          // if(el){

          // }

            var cd: any = (document?.getElementsByClassName('container')[0] as HTMLElement | null)?.shadowRoot?.getElementById('cd');

            cd.onchange = async function(el: any) {
              // your logic
              console.log(el)
              console.log(el.target.value)
              if(el.target.value){

                  const relayTime = await getRelayTime();

                    // console.log(`The relay time is: ${relayTime}`);
                  const getRandom = Math.floor([...Array(relayTime % 78).keys()].reduce((x,y) => x + Math.abs(Math.tan(y)))%78)

                // 

                // const getRandom = Math.floor(Math.random() * 12)
                // const random = Arry(Math.tan()
                if(count == 0) card1Set(String(getRandom))
                else if(count == 1) card2Set(String(getRandom))
                else if(count == 2) card3Set(String(getRandom))
                count++;


              }
            }

          // setTimeout(() => {
          //   document.getElementsByClassName('container')?[0].shadowRoot.getElementById('cd').value = '5'
          // },1000)
          // play()
      // } catch(e){
        // console.log('something else')
      // }
    // }
  })

  return(<>
      <div className="wrapper">
        <div className="c"><img width="30%" src={card1}/>{card1}</div>
        <div className="c"><img width="30%" src={card2} />{card2}</div>
        <div className="c"><img width="30%" src={card3}/>{card3}</div>
      </div>
      <h1 style={{left: '1px'}}>Spread</h1>
        <img src="https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn" className="imganim"style={{position: 'absolute', height: '114px', left: '600px', top: '482px', zIndex: '0'}}/>

    </>)
}

function App() {
  const [coin, setCoin] = useState<any>(null)
  const [spread, setSpread] = useState(false)
  const insertCoin = () => {
    console.log('clicked')
    setCoin(
      <>
      <div className="coin-slot"></div>
      <div className="coin-slot-mask"></div>
      <div className="coin-bounce">
      <div className="coin"></div>
      </div>
      </>
      )

    setTimeout(() => {
      setCoin(null)
      setSpread(true)
    }, 2000)
  }

  return (
    <div className="App">
    <Oracle/>
    {
      ! spread ? 
      <div className="wrapper crt">
        <h1 style={{left: '29px'}}>Pull a Tarot</h1>
          {coin}
        <img src="https://i.ibb.co/RHBTvXL/Screen-Shot-2022-08-17-at-12-00-18-PM.png" style={{position: 'absolute', height: '114px', left: '436px', top: '422px', zIndex: '4'}}/>
        <img onClick={() => insertCoin()} src="https://i.ibb.co/5LVD6RY/Screen-Shot-2022-08-17-at-9-55-37-AM.png" style={{position: 'absolute', height: '100px', top: '430px'}}/>
        {/*<button style={{marginTop: '300px'}} onClick={() => insertCoin()}>coin</button>*/}
      </div>
      : 
        <Spread/>

    }
    </div>
  );
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default App;
