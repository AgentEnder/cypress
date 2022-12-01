const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const escapeString = (string) => string.replaceAll(`\``, `\\\``).replaceAll(`$`, `\\$`)

function read ({ file }) {
  const pathToFile = require.resolve(`./${file}`)

  return fs.readFileSync(pathToFile, 'utf8')
}

const getBinaryEntryPointSource = () => {
  return read({ file: 'binary-entry-point-source.js' })
}

const getIntegrityCheckSource = (baseDirectory) => {
  const fileSource = read({ file: 'binary-integrity-check-source.js' })
  const secret = require('crypto').randomBytes(48).toString('hex')

  const mainIndexHash = crypto.createHmac('md5', secret).update(fs.readFileSync(path.join(baseDirectory, './index.js'), 'utf8')).digest('hex')
  const bytenodeHash = crypto.createHmac('md5', secret).update(fs.readFileSync(path.join(baseDirectory, './node_modules/bytenode/lib/index.js'), 'utf8')).digest('hex')
  const indexJscHash = crypto.createHmac('md5', secret).update(fs.readFileSync(path.join(baseDirectory, './packages/server/index.jsc'), 'utf8')).digest('hex')
  const pathJoinHash = crypto.createHmac('md5', secret).update(path.join.toString()).digest('hex')

  return fileSource.split('\n').join(`\n  `)
  .replaceAll('MAIN_INDEX_HASH', mainIndexHash)
  .replaceAll('BYTENODE_HASH', bytenodeHash)
  .replaceAll('INDEX_JSC_HASH', indexJscHash)
  .replaceAll('HMAC_SECRET', secret)
  .replaceAll('PATH_JOIN_HASH', pathJoinHash)
  .replaceAll('CRYPTO_CREATE_HMAC_TO_STRING', escapeString(crypto.createHmac.toString()))
  .replaceAll('CRYPTO_HMAC_UPDATE_TO_STRING', escapeString(crypto.Hmac.prototype.update.toString()))
  .replaceAll('CRYPTO_HMAC_DIGEST_TO_STRING', escapeString(crypto.Hmac.prototype.digest.toString()))
}

module.exports = {
  getBinaryEntryPointSource,
  getIntegrityCheckSource,
}
