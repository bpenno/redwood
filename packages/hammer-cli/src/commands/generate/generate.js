import path from 'path';
import React from 'react';
import { Box, Text, Color } from 'ink';

import { hammerWorkspaceDir, writeFile, bytes } from 'src/lib';
import component from './component';

const getGenerator = generator =>
  ({
    component,
  }[generator]);

const DEFAULT_COMPONENT_DIR = path.join(
  hammerWorkspaceDir(),
  './web/src/components/'
);

const Generate = ({ args }) => {
  const [
    _commandName,
    generatorName,
    name,
    targetDir = DEFAULT_COMPONENT_DIR,
  ] = args;

  const generator = getGenerator(generatorName);

  // If no generator is specified list the
  if (!generator || !name) {
    return (
      <>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold underline>
            Usage:
          </Text>
          <Text>
            hammer generate {generatorName || 'GENERATOR'} [name] [path]
          </Text>
        </Box>
        <Box flexDirection="column">
          <Text bold underline>
            Available generators:
          </Text>
          <Text marginLeft={1}> component</Text>
        </Box>
      </>
    );
  }

  const files = generator(name);
  const results = Object.keys(files).map(filename => {
    const contents = files[filename];
    try {
      writeFile(path.join(targetDir, filename), contents);
      return (
        <Text key={`wrote-${filename}`}>
          Wrote {filename} {bytes(contents)} bytes
        </Text>
      );
    } catch (e) {
      return (
        <Text key={`error-${filename}`}>
          <Color red>{e}</Color>
        </Text>
      );
    }
  });

  return results;
};

export const commandProps = {
  alias: 'g',
  description: 'save time by generating boilerplate code',
};

export default Generate;