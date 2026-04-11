import React, { useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Equation({ latex, fontSize=18 }: { latex: string, fontSize?: number }) {
  const [height, setHeight] = useState(40);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        font-size: ${fontSize}px; 
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="math"></div>

    <script>
      katex.render("${latex}", document.getElementById("math"), {
        throwOnError: false
      });

      setTimeout(() => {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(height);
      }, 100);
    </script>
  </body>
  </html>
  `;

  return (
    <View style={{ width: '100%', alignSelf: 'center', minHeight: height }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        scrollEnabled={false}
        onMessage={(event) => {
          setHeight(Number(event.nativeEvent.data));
        }}
        style={{
          height,
          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}