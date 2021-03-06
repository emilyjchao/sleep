import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';
import colors from './colors';


// renders the day component
 class DayDetail extends Component {
   constructor(props) {
     super();
   }

   render () {
     //Set up stack daily view sleep data
     let ySleep = [];
     let in_out = [];
     for (i=0; i<this.props.boards[this.props.picked].enters.length; i++) {
       //Set x and y data arrays
       if (this.props.boards[this.props.picked].exited[i]) {
         //For line graph
         in_out.push("1"); //1 represents in bed
         ySleep.push(new Date(this.props.boards[this.props.picked].enters[i]));
         in_out.push("0");
         ySleep.push(new Date(this.props.boards[this.props.picked].exited[i]));
       }
     }
     //If no data for sleep, set up fake data
     if (ySleep.length == 0) {
       ySleep = [new Date(), new Date()];
       in_out = [0, 0]
     }
     let sleepData = [];
     for (i=0; i<ySleep.length; i++) {
       sleepData.push({x: ySleep[i], y: in_out[i]});
       //ySleep[i] = ySleep[i].getTime();
     }
     let restlessData = [];
     for (i=0; i<this.props.boards[this.props.picked].restNum.length; i++) {
       restlessData.push({x: this.props.boards[this.props.picked].restTime[i], y: this.props.boards[this.props.picked].restNum[i]});
     }

     //Set up labels for sleep chart
     // making reasonable time ticks between asleep time and awake time
     let label1 = ySleep[0];
     let label4 = ySleep[ySleep.length-1];
     let increment = Math.floor((ySleep[ySleep.length-1].getTime()-ySleep[0].getTime())/3);
     let label2 = new Date(label1.getTime() + increment);
     let label3 = new Date(label2.getTime() + increment);
     let sleepLabel = [label1, label2, label3, label4];

     //Set up labels for restlessness
     // see above
     let restlessLabel = []
     //Add to array if restlessness is longer than 1 hour
     if ((this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1].getTime() - this.props.boards[this.props.picked].restTime[0].getTime()) <= 60000) {
      label1 = this.props.boards[this.props.picked].restTime[0];
      label4 = this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1];
      increment = Math.floor((this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1].getTime()-this.props.boards[this.props.picked].restTime[0].getTime())/3);
      label2 = new Date(label1.getTime() + increment);
      label3 = new Date(label2.getTime() + increment);
      restlessLabel = [label1, label2, label3, label4];
     }

     //Build text to display for bedwetting table
     let bedWetContent;
     if(this.props.boards[this.props.picked].bedwet.length > 0){
       let wetTime = new Date(this.props.boards[this.props.picked].bedwet[0]);
       bedWetContent = "Wet     " + this.props.formatTime(wetTime) ;
     }
     else {
       bedWetContent = "Dry";
     }

     // input tutorial text if in tutorial mode
     // display sleep graph
     // display movement graph
     // display bed wetting and bed exit tables
    return(
      <View style={styles.headerWrapper}>
      {this.props.tutorial ?
        <View><Text style={styles.smallTextMarg}>Press the i button to turn
        Tutorial Mode off.
        </Text>
        <Text style={styles.smallTextMarg}>The daily view shows
        more detailed information about the metrics from the weekly page.
        Use the arrows below to scroll through different days. Have a look
        around and then click on Month above.
      </Text></View> : ""}
        <View style={styles.triplet}>
        {this.props.moreDays(-1) ?
            <Button
              buttonStyle={styles.tripletButton}
              icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
              onPress={() => this.props.changePicked(-1)}
            /> :
            <Button
              buttonStyle={styles.tripletButton}
              icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
              onPress={() => this.props.changePicked(-1)}
            />
          }
          <Text style={styles.tripletText}>{this.props.boards[this.props.picked].day}</Text>
          {this.props.moreDays(1) ?
            <Button
              buttonStyle={styles.tripletButton}
              icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
              onPress={() => this.props.changePicked(1)}
            /> :
            <Button
              buttonStyle={styles.tripletButton}
              icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
              onPress={() => this.props.changePicked(1)}
            />
          }
        </View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Shaded = time in bed \n Unshaded = time out of bed')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.titleNoMargin}>Sleep: {this.props.hrToMin((this.props.boards[this.props.picked].sleep).toFixed(2))}</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>

        {this.props.tutorial ?
          <Text style={styles.smallTextMarg}>Last night's sleep, blue areas show time in bed and unfilled areas show time out of bed.
          </Text> : ""}
        <View style={styles.chart}>
        <VictoryChart
          height={130}
          scale={{x: 'time', y: 'linear'}}
          domain={{x: [ySleep[0], ySleep[ySleep.length-1]], y: [1.1, 2]}}
          >
          <VictoryArea
            data={sleepData}
              x="x" y="y"
            interpolation="stepBefore"
            style={{
              data: { stroke: colors.asleepBar, fill: colors.asleepBar },
            }}
            />
          <VictoryAxis
            tickFormat={(d) => this.props.formatTime(d)}
            tickValues={sleepLabel}
            style={{fontSize: 16, fontFamily: "Futura",
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: "Futura"}
              }}
            fixLabelOverlap
            />
        </VictoryChart>
        </View>

        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Movement on a scale of 0 (low) - 100 (high)')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Movement</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallTextMarg}>Restless illustrates how much your child
            moved while sleeping. It is divided into low, normal, and high indicating
            the relative amount of movement. Movement is ranked on a scale of 0 to 100.
          </Text> : ""}
        <Text style={styles.brightTextNoMargin}>{this.props.restlessDescription} : {this.props.avgRestless}</Text>
        //Line graph of restlessness
        <View style={styles.chart}>
        <VictoryChart
          height={150}
          domainPadding={{ x : [20, 20] }}
          maxDomain={{y: 73}}
          scale={{ x: "time" }}
          >
          <VictoryLine
            interpolation="natural"
            style={{
              data: { stroke: colors.awakeBar },
            }}
            data = {restlessData}
            />
          <VictoryAxis
            tickFormat={(d) => this.props.formatTime(d)}
            tickValues={sleepLabel}
            style={{fontSize: 16, fontFamily: "Futura", axisLabel: { padding: 35, fill: colors.axis},
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: "Futura"}
              }}
            fixLabelOverlap
            />
          <VictoryAxis dependentAxis
            label="Low     High"
            style={{
              axisLabel: { padding: 10, fill: colors.axis, fontFamily: "Futura"},
              tickLabels: { fill: colors.axis},
              ticks: {stroke: colors.axis},
              fontSize: 16,
              fontFamily: "Futura",
              axis: {stroke: colors.axis},
              transform: [{ rotate: '90deg'}]
            }}
            tickFormat={() => ''}
            />
        </VictoryChart>
        </View>

        {this.props.tutorial ?
          <Text style={styles.smallText}>Bedwets displays the time of a bedwetting incident,
          and bed exits displays the time and duration of exits.
          </Text> : ""}

        <View style={styles.twoColumnContainer}>
          <View style={styles.twoColumnColumn}>
            <TouchableOpacity
              onPress={() => {Alert.alert('Times of bed wets')}}
              style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.title}>Bedwets</Text>
                  <Image source={require('./about.png')} style={styles.icon} />
                </View>
            </TouchableOpacity>

            <Text style={styles.brightText}>{bedWetContent}</Text>
          </View>

        //Table for bed exits
        <View style={styles.twoColumnColumn}>
          <View style={styles.appContainer}>
            <TouchableOpacity
              onPress={() => {Alert.alert('Times and durations of bed exits')}}
              style={styles.button1}>
              <View style={styles.btnContainer}>
                <Text style={styles.title}>Bed Exits</Text>
                <Image source={require('./about.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.brightText}>{'  '}Time{'\t\t'}  Minutes</Text>
          // This code for rendering table is from:
          // https://stackoverflow.com/questions/44357336/setting-up-a-table-layout-in-react-native
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
              this.props.boards[this.props.picked].exited.map((time, index) => { // This will render a row for each data element.
                if (this.props.boards[this.props.picked].exited.length <= 1 || this.props.boards[this.props.picked].exited == undefined) {
                  return (
                      <Text key={time} style={styles.brightTextLeft}>
                        {'\t'}{'--'}{'\t\t\t'}{'--'}
                      </Text>
                  );
                }
                else if (index != this.props.boards[this.props.picked].exited.length-1){
                  var exitTime = new Date(time);
                  var enterTime = new Date(this.props.boards[this.props.picked].enters[index + 1]);
                  var dif = new Date(enterTime-exitTime);
                  var timeOut = dif / (60000);
                  return (
                      <Text key={time} style={styles.brightTextLeft}>
                        {this.props.formatTime(exitTime)}{'\t\t'}{(this.props.minToSec(timeOut))}
                      </Text>
                  );
                }
              })
            }
          </View>
          </View>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallTextMarg}>Scroll back to the top and check out the monthly view!
          </Text> : ""}
      </View>);

  }
}

export default DayDetail;
