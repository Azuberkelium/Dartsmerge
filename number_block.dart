// A class to represent a single number block in the game.
class NumberBlock {
  final int value;
  final String color;

  NumberBlock(this.value, this.color);

  // A factory constructor to create a 'miss' block.
  factory NumberBlock.miss() {
    return NumberBlock(0, 'grey'); // '0' value to indicate it's not a real number, 'grey' color.
  }
}
