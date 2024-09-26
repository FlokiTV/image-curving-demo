var warped_image = document.getElementById("warped_image"),
  warp_canvas = document.createElement("canvas"),
  warp_context = warp_canvas.getContext("2d");
warp_context.imageSmoothingEnabled = true;
warp_context.imageSmoothingQuality = "high"; // Pode ser 'low', 'medium', ou 'high'
// inputs
var warp_size_input = document.getElementById("warp_size");

function getQuadraticBezierXYatT(start_point, control_point, end_point, T) {
  var pow1minusTsquared = Math.pow(1 - T, 2),
    powTsquared = Math.pow(T, 2);

  var x =
      pow1minusTsquared * start_point.x +
      2 * (1 - T) * T * control_point.x +
      powTsquared * end_point.x,
    y =
      pow1minusTsquared * start_point.y +
      2 * (1 - T) * T * control_point.y +
      powTsquared * end_point.y;

  return {
    x: x,
    y: y,
  };
}

function warpHorizontally(image_to_warp, invert_curve) {
  var image_width = image_to_warp.width,
    image_height = image_to_warp.height,
    warp_x_offset = Number(warp_size_input.value);

  warp_canvas.width = image_width + Math.ceil(warp_x_offset * 2);
  warp_canvas.height = image_height;

  // see https://www.rgraph.net/blog/an-example-of-the-html5-canvas-quadraticcurveto-function.html
  // for more details regarding start_point, control_point si end_point
  var start_point = {
    x: 0,
    y: 0,
  };
  var control_point = {
    x: invert_curve ? warp_x_offset : -warp_x_offset,
    y: image_height / 2,
  };
  var end_point = {
    x: 0,
    y: image_height,
  };

  var offset_x_points = [],
    t = 0;
  for (; t < image_height; t++) {
    var xyAtT = getQuadraticBezierXYatT(
        start_point,
        control_point,
        end_point,
        t / image_height
      ),
      x = parseInt(xyAtT.x);

    offset_x_points.push(x);
  }

  warp_context.clearRect(0, 0, warp_canvas.width, warp_canvas.height);

  var y = 0;
  for (; y < image_height; y++) {
    warp_context.drawImage(
      image_to_warp,
      // clip 1 pixel wide slice from the image
      //x, 0, 1, image_height + warp_y_offset,
      0,
      y,
      image_width + warp_x_offset,
      1,
      // draw that slice with a y-offset
      //x, warp_y_offset + offset_y_points[x], 1, image_height + warp_y_offset
      warp_x_offset + offset_x_points[y],
      y,
      image_width + warp_x_offset,
      1
    );
  }
}

function warpVertically(image_to_warp, invert_curve) {
  var image_width = image_to_warp.width,
    image_height = image_to_warp.height,
    warp_y_offset = Number(warp_size_input.value);

  warp_canvas.width = image_width;
  warp_canvas.height = image_height + Math.ceil(warp_y_offset * 2);

  // see https://www.rgraph.net/blog/an-example-of-the-html5-canvas-quadraticcurveto-function.html
  // for more details regarding start_point, control_point si end_point
  var start_point = {
    x: 0,
    y: 0,
  };
  var control_point = {
    x: image_width / 2,
    y: invert_curve ? warp_y_offset : -warp_y_offset,
  };
  var end_point = {
    x: image_width,
    y: 0,
  };

  var offset_y_points = [],
    t = 0;
  for (; t < image_width; t++) {
    var xyAtT = getQuadraticBezierXYatT(
        start_point,
        control_point,
        end_point,
        t / image_width
      ),
      y = xyAtT.y; //parseInt(xyAtT.y);

    offset_y_points.push(y);
  }

  warp_context.clearRect(0, 0, warp_canvas.width, warp_canvas.height);

  var x = 0;
  for (; x < image_width; x++) {
    warp_context.drawImage(
      image_to_warp,
      // clip 1 pixel wide slice from the image
      x,
      0,
      1,
      image_height + warp_y_offset,
      // draw that slice with a y-offset
      x,
      warp_y_offset + offset_y_points[x],
      1,
      image_height + warp_y_offset
    );
  }
}

function warpImage() {
  var image_to_warp = new Image();

  image_to_warp.onload = function () {
    // var warp_orientation = document.querySelector(
    //     'input[name="warp_orientation"]:checked'
    //   ).value,
    let invert_curve = document.getElementById("invert_curve").checked;
    warp_orientation = "vertical";

    if (warp_orientation === "horizontal") {
      warpHorizontally(image_to_warp, invert_curve);
    } else {
      warpVertically(image_to_warp, invert_curve);
    }
    warped_image.src = warp_canvas.toDataURL();
  };

  image_to_warp.src = "test.png";
}
warpImage();

window.warpImage = warpImage;
