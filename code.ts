// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-isolation") {
    if (figma.currentPage.selection.length !== 1) {
      //@ts-ignore
      alert("1つのオブジェクトを選択してください。");
    } else {
      const node = figma.currentPage.selection[0];
      let unit_length = 0;
      let x_offset = 0;
      let y_offset = 0;
      let inner_rect_width = 0;
      let inner_rect_height = 0;

      if (msg.option == "width") {
        //横幅を基準に
        unit_length = node.width / msg.count;
        x_offset = unit_length;
        y_offset = 0;
        inner_rect_height = node.height;
        inner_rect_width = unit_length;
      } else {
        unit_length = node.height / msg.count;
        x_offset = 0;
        y_offset = unit_length;
        inner_rect_height = unit_length;
        inner_rect_width = node.width;
      }
      //corner_rectangle
      for (let i = 0; i < 4; i++) {
        const rect = figma.createRectangle();
        if (i < 2) {
          rect.y = node.y - unit_length;
        } else {
          rect.y = node.y + node.height;
        }

        if (i % 2 == 1) {
          rect.x = node.x - unit_length;
        } else {
          rect.x = node.x + node.width;
        }

        rect.resize(unit_length, unit_length);
        //現状はfillの透明度を0にしているが, fillsをそもそも存在させない方法がないか？
        rect.fills = [
          { type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 0 },
        ];
        rect.strokes = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
        figma.currentPage.appendChild(rect);
      }

      //inner_rectangle
      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = node.x + x_offset * i;
        rect.y = node.y + y_offset * i;
        rect.resize(inner_rect_width, inner_rect_height);
        //現状はfillの透明度を0にしているが, fillsをそもそも存在させない方法がないか？
        rect.fills = [
          { type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 0 },
        ];
        rect.strokes = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
        figma.currentPage.appendChild(rect);
      }
    }
  }
};
