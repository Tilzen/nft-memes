import React, { useState, useEffect } from 'react'
import Web3 from 'web3'

import './App.css'

import Meme from './abis/Meme.json'


function App() {
  let newMeme

  const [account, setAccount] = useState('')
  const [contract, setContract] = useState({})
  const [totalSupply, setTotalSupply] = useState(0)
  const [memes, setMemes] = useState([])

  useEffect(() => {
    async function load() {
      await loadWeb3()
      await loadBlockchainData()
    }

    load()
  }, [])
  
  
  async function loadWeb3() {
    window.web3 = new Web3.providers.HttpProvider('http://localhost:8545')

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]

    if(networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const newContract = new web3.eth.Contract(abi, address)
      setContract(newContract)

      const newTotalSupply = await contract.methods.totalSupply().call()
      setTotalSupply(newTotalSupply)

      for (let i = 1; i <= totalSupply; i++) {
        const meme = await contract.methods.memes(i - 1).call()
        setMemes([...memes, meme])
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  function mint(meme) {
    contract.methods.mint(meme).send({ from: account })
      .once('receipt', receipt => {
        setMemes([...memes, meme])
      })
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Meme Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
              <form onSubmit={(event) => {
                event.preventDefault()
                mint(newMeme.value)
              }}>
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='e.g. ssssssssssssssssssss'
                  ref={(input) => { newMeme = input }}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='MINT'
                />
              </form>
            </div>
          </main>
        </div>
        <hr/>
        <div className="row text-center">
          { memes.map((meme, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundMeme: meme }}></div>
                <div>{ meme }</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


export default App