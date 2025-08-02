import 'dart:math';
import 'number_block.dart';

// This is a placeholder for the main game logic class.
// We'll add more to this later.
class Game {
  // A list of all possible number blocks and their colors.
  final Map<int, String> _blockColors = {
    2: 'red',
    4: 'orange',
    8: 'yellow',
    16: 'green',
    32: 'blue',
    64: 'indigo',
    128: 'violet',
    256: 'cyan',
    512: 'magenta',
    1024: 'lime',
    2048: 'teal',
    4096: 'purple',
  };

  final Random _random = Random();

  NumberBlock generateNextBlock() {
    // There's a chance a 'miss' block appears. Let's say a 1 in 5 chance.
    if (_random.nextInt(5) == 0) {
      print('Generated a Miss block!');
      return NumberBlock.miss();
    }
    
    // Otherwise, generate a random number block.
    // We'll start with 2s and 4s as the most common initial blocks.
    final blockValue = _random.nextInt(2) == 0 ? 2 : 4;
    print('Generated a $blockValue block!');
    
    final blockColor = _blockColors[blockValue]!;
    return NumberBlock(blockValue, blockColor);
  }
}
