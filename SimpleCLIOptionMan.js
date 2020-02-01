/**
 * Simple CLI option manager
 * @member {Set} options Set that stores options as flags
 */
class SimpleCLIOptionMan {
  /**
   * Creates simple CLI option manager instance
   * @param {string} o String of options starting with the '-' character
   */
  constructor(o) {
    if(!o) throw new Error('Options must be given to SimpleCLIOptionMan.')

    if(o[0] !== '-') throw new Error('Improper option format.')

    this.options = new Set()

    for(let i=1; i < o.length; i+=1) {
      this.options.add(o[i])
    }
  }

  /**
   * Returns state of flag
   * @param {string} flag Character representing flag
   * @returns {boolean} True is flag is set, false otherwise
   */
  getFlag(flag) {
    return this.options.has(flag)
  }
}

module.exports = SimpleCLIOptionMan
