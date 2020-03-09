import React, { useState, useEffect } from 'react';
import { } from 'react-native';
import {
  Container, Header, Title, Content, Footer,
  FooterTab, Button, Left, Right, Body, Icon, Text,
  Accordion, Card, CardItem, Thumbnail, ListItem,
  CheckBox, DatePicker, DeckSwiper, Fab, View,
  Badge, Form, Item, Input, Label, Picker, Textarea,
  Switch, Radio, Spinner, Tab, Tabs, TabHeading,
  ScrollableTab, H1, H2, H3, Drawer,
} from 'native-base';
import * as Font from 'expo-font'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import useInterval from 'react-useinterval'
import openMap from 'react-native-open-maps'

const LOCATION_TASK_NAME = 'background-location-task';
let background_location = null

export default function App() {
  const [loadfont, setloadfont] = useState(true)
  const [permission_status, setpermission_status] = useState('undetermined')
  const [acc, setacc] = useState(-1)
  const [altitude, setaltitude] = useState(-1)
  const [heading, setheading] = useState(-1)
  const [latitude, setlatitude] = useState(-1)
  const [longitude, setlonggitude] = useState(-1)
  const [speed, setspeed] = useState(-1)
  const [time, settime] = useState('')
  const [updatePeriod, setupdatePeriod] = useState(null)
  const [address, setaddress] = useState(null)

  useEffect(() => {
    initializeApp()
    return () => stop_update_location()
  }, [])

  initializeApp = async () => {
    const { status } = await Location.requestPermissionsAsync()
    setpermission_status(status)

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    })
    setloadfont(false)
  }

  useInterval(() => (
    update_location()
  ), updatePeriod);

  update_location = async () => {

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
    })

    if (background_location) {
      const e = background_location.coords
      setacc(e.accuracy)
      setaltitude(e.altitude)
      setheading(e.heading)
      setlatitude(e.latitude)
      setlonggitude(e.longitude)
      setspeed(e.speed)
      settime(Date(background_location.timestamp).toString())
    }
  }

  stop_update_location = async () => {
    setupdatePeriod(null)
    const taskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
    if (taskRegistered) {
      await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME)
    }
  }

  search_address = async () => {
    if (background_location) {
      const _address = await Location.reverseGeocodeAsync(background_location.coords)
      setaddress(_address[0])
    }
  }

  open_map = () => {
    if (background_location) {
      const e = background_location.coords
      openMap({ latitude: e.latitude, longitude: e.longitude })
    }
  }

  if (permission_status !== 'granted') {
    <Container style={{ backgroundColor: '#1C2833' }}>
      <Text>App needs location permission granted</Text>
    </Container>
  }

  if (loadfont) {
    return <Container style={{ backgroundColor: '#1C2833' }}><Spinner /></Container>
  }

  return (
    <Container style={{ backgroundColor: '#1C2833' }}>
      <Content style={{ marginTop: 25 }}>
        <Card style={{ backgroundColor: '#1C2833' }}>
          <CardItem header bordered style={{ backgroundColor: "#1C2833" }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <H3 style={{ color: '#D0D3D4' }}>Realtime GPS</H3>
              <H3 style={{ color: "#D0D3D4" }}>+</H3>
            </View>
          </CardItem>
          <CardItem bordered style={{ backgroundColor: '#1C2833' }}>
            <Text style={{ color: "#D0D3D4", fontStyle: 'italic' }}>
              Accuracy: {acc} Meters{'\n'}
              Altitude: {altitude} Meters{'\n'}
              Heading: {heading} Degree{'\n'}
              Latitude: {latitude} Degree{'\n'}
              Longitude: {longitude} Degree{'\n'}
              Speed: {speed} M/S{'\n'}
              Time: {time}
            </Text>
            <Button light small bordered icon style={{ position: 'absolute', right: 10, top: 10 }}>
              <Icon name='copy'></Icon>
            </Button>
          </CardItem>
          <CardItem header bordered style={{ backgroundColor: '#1C2833' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <H3 style={{ color: '#D0D3D4' }}>Address (update location first)</H3>
              <H3 style={{ color: '#D0D3D4' }}>+</H3>
            </View>
          </CardItem>
          <CardItem style={{ backgroundColor: '#1C2833' }}>
            {address ?
              <Text style={{ color: '#D0D3D4' }}>
                {address.name}  {address.street} {'\n'}
                {address.city} {address.region} {address.country}  {address.postalCode}
              </Text>
              : <Text style={{ color: '#D0D3D4' }}>Waiting for GPS location</Text>}
          </CardItem>
          <Button light small bordered icon style={{ position: 'absolute', right: 10, top: 10 }}>
            <Icon name='copy'></Icon>
          </Button>
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 10 }}>
          <Button small style={{ width: 150, justifyContent: "center" }} onPress={() => setupdatePeriod(1000)}>
            <Text>Update Location</Text>
          </Button>
          <Button small style={{ width: 150, justifyContent: "center" }} onPress={() => stop_update_location()}>
            <Text>Stop Update</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 10 }}>
          <Button small style={{ width: 150, justifyContent: "center" }} onPress={() => search_address()}>
            <Text>Search Address</Text>
          </Button>
          <Button small style={{ width: 150, justifyContent: "center" }} onPress={() => open_map()}>
            <Text>Open Map</Text>
          </Button>
        </View>
      </Content>
    </Container>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error.message)
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    background_location = locations[locations.length - 1]
  }
});

