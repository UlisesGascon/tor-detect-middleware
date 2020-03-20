const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const adapter = new FileSync(path.join(__dirname, './db.json'))
const db = low(adapter)
db.defaults({ exit_nodes: [] }).write()

module.exports = {
  setNodes: (nodes) => db.set('exit_nodes', nodes).write(),
  getNodes: () => db.get('exit_nodes').value(),
  getTotal: () => {
    const ips = db.get('exit_nodes').value()
    return ips ? ips.length : 0
  },
  clean: () => db.unset('exit_nodes').write()
}
