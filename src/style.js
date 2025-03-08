

import { css } from 'lit';

const style = css`
#tfl-status {
  padding:16px;
}
.row {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding:5px;
  margin: 1px;
  justify-content: center;
  align-items: left;
}
.line {
  height: 30px;
  font-weight: bold;
}
.status {
  height: 30px;
}

.warning {
background:rgb(233, 208, 128);
color: black;
}


.bakerloo {
background: #ae6118;
color: white;
}
.central {
background: #e41f1f;
color: white;
}
.circle {
background: #f8d42d;
color: #113b92;
}
.district {
background: #00a575;
color: white;
}
.dlr {
background: #00bbb4;
color: white;
}
.elizabeth-line {
background: #6950a1;
color: white;
}
.hammersmith-city {
background: #e899a8;
color: #113b92;
}
.jubilee {
background: #8f989e;
color: white;
}
.metropolitan {
background: #893267;
color: white;
}
.northern {
background: black;
color: white;
}
.piccadilly {
background: #0450a1;
color: white;
}
.victoria {
background: #009fe0;
color: white;
}
.waterloo-city {
background: #70c3ce;
color: #113b92;
}
.liberty {
background: #61686b;
color: white;
}
.lioness {
background: #ffa600;;
color: #113b92;
}
.mildmay {
background: #006fe6;
color: white;
}
.suffragette {
background: #18a95d;
color: #113b92;
}
.weaver {
background: #9b0058;
color: white;
}
.windrush {
background: #dc241f;
color: white;
}
`;

export default style;
