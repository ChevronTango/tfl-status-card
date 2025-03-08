# Lovelace TFL Status Card
A status card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI for showing the London Underground lines and their current status.

The card works with entities from within the **sensor**  domain and is intended to be used with entities from the [London Underground Integration](https://www.home-assistant.io/integrations/london_underground/).

![Preview](images/sample.png)

## Install

### HACS (recommended) 

This card is available in [HACS](https://hacs.xyz/) (Home Assistant Community Store).
<small>*HACS is a third party community store and is not included in Home Assistant out of the box.*</small>

### Manual install

1. Download and copy `tfl-status-card.js` from the [latest release](https://github.com/ChevronTango/tfl-status-card/releases/latest) into your `config/www` directory.

2. Add the resource reference as decribed below.


### CLI install

1. Move into your `config/www` directory.

2. Grab `tfl-status-card.js`:

  ```
  $ wget https://github.com/ChevronTango/ha-tfl-status-card/releases/download/v0.0.1/tfl-status-card.js
  ```

3. Add the resource reference as decribed below.

### Add resource reference

If you configure Lovelace via YAML, add a reference to `tfl-status-card.js` inside your `configuration.yaml`:

  ```yaml
  resources:
    - url: /local/tfl-status-card.js?v=0.0.1
      type: module
  ```

Else, if you prefer the graphical editor, use the menu to add the resource:

1. Make sure, advanced mode is enabled in your user profile (click on your user name to get there)
2. Navigate to Configuration -> Lovelace Dashboards -> Resources Tab. Hit orange (+) icon
3. Enter URL `/local/tfl-status-card.js` and select type "JavaScript Module".
(Use `/hacsfiles/tfl-status-card/tfl-status-card.js` and select "JavaScript Module" for HACS install)
4. Restart Home Assistant.

## Using the card

We recommend looking at the [Example usage section](#example-usage) to understand the basics to configure this card.
(also) pay attention to the **required** options mentioned below.

### Options

#### Card options
| Name | Type | Default | Since | Description |
|------|:----:|:-------:|:-----:|-------------|
| type ***(required)*** | string |  | v0.0.1 | `custom:tfl-status-card`.
| entities ***(required)*** | list |  | v0.0.1 | One or more sensor entities in a list, see [entities object](#entities-object) for additional entity options.


#### Entities object
Entities may be listed directly (as per `sensor.temperature` in the example below), or defined using
properties of the Entity object detailed in the following table (as per `sensor.pressure` in the example below).

| Name | Type | Default | Description |
|------|:----:|:-------:|-------------|
| entity ***(required)*** | string |  | Entity id of the sensor.
| name | string |  | Set a custom display name, defaults to entity's friendly_name.

```yaml
entities:
  - sensor.picadilly
  - entity: sensor.central
    name: Central Line
  - sensor.victoria
```

## Development

1. Clone this repository into your `config/www` folder using git:

```
$ git clone https://github.com/ChevronTango/ha-tfl-status-card.git
```

2. Add a reference to the card in your `ui-lovelace.yaml`:

```yaml
resources:
  - url: /local/tfl-status-card/dist/tfl-status-card.js
    type: module
```

### Instructions

*Requires `nodejs` & `npm`.*

1. Move into the `tfl-status-card` repo, checkout the *dev* branch & install dependencies:
```console
$ cd tfl-status-card && git checkout dev && npm install
```

2. Make changes to the source code.

3. Build the source by running:
```console
$ npm run build
```

4. Refresh the browser to see changes.

    *Make sure cache is cleared or disabled.*

5. *(Optional)* Watch the source and automatically rebuild on save:
```console
$ npm run watch
```

*The new `tfl-status-card.js` will be build and ready inside `/dist`.*

Note that the `dev` branch is the most up-to-date and matches our beta releases.

Please refer to the [Contribution Guidelines](./CONTRIBUTING.md) if you're interested in contributing to the project. (And thanks for considering!)

## Getting errors?
Make sure you have `javascript_version: latest` in your `configuration.yaml` under `frontend:`.

Make sure you have the latest versions of `tfl-status-card.js` & `tfl-status-lib.js`.

If you have issues after updating the card, try clearing your browser cache.

If you have issues displaying the card in older browsers, try changing `type: module` to `type: js` at the card reference in `ui-lovelace.yaml`.

## License
This project is under the MIT license.
