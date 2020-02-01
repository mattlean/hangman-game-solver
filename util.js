module.exports = {
  /**
   * Generate random integer that is
   * greater than or equal to min
   * and less than or equal to max
   * @param {number} min Minimum integer
   * @param {number} max Maximum integer
   * @returns {number} Random integer
   */
  getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Fisher–Yates shuffle
   * Randomly shuffles values in array.
   * @param {Array} array Array of values to be shuffled
   */
  shuffle(array) {
    for(var i=0; i < array.length-2; i+=1) {
      const j = Math.floor(Math.random() * (array.length - i)) + i;
      const temp = array[i];

      array[i] = array[j];
      array[j] = temp;
    }
  }
}
