const chai = require('chai')

chai.use(require('chai-as-promised')).should()

const Meme = artifacts.require('./Meme.sol')

contract('Meme', accounts => {
    let contract

    const sanic = './test/fixtures/sanic.jpg'
    const disasterGirl = './test/fixtures/disaster-girl.jpg'
    const peaceWNAO = './test/fixtures/peace-was-never-an-option.jpg'

    before(async () => {
        contract = await Meme.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address

            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a valid name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Meme')
        })

        it('has a valid symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'MEME')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            const result = await contract.mint(sanic)
            const totalSupply = await contract.totalSupply()

            // success cases
            const event = result.logs[0].args
            assert.equal(totalSupply, 1)
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            // failure case
            await contract.mint(sanic).should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('list memes', async () => {
          await contract.mint(disasterGirl)
          await contract.mint(peaceWNAO)
          const totalSupply = await contract.totalSupply()
    
          let meme
          let result = []
    
          for (var i = 1; i <= totalSupply; i++) {
            meme = await contract.memes(i - 1)
            result.push(meme)
          }
    
          let expected = [sanic, disasterGirl, peaceWNAO]
          assert.equal(result.join(','), expected.join(','))
        })
      })
})