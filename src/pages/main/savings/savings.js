import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Container, TouchWrap, scaleFont, SizedBox, Page, ImageWrap, Avatar} from '@burgeon8interactive/bi-react-library';
import {
  H1,
  H2,
  TouchFeedback,
  P,
  Button,
  TransferMoney,
  FundWallet,
  Warning,
  AddMoney,
  SavingsLoader,
  AddBVN,
  AddPhone,
} from '../../../components/component';
import Colors from '../../../helpers/colors';
import numeral from 'numeral';
import {Dashboard} from './dashboard';
import transfefPNG from '../../../../assets/img/money_transer.png';
import travellersPNG from '../../../../assets/img/travellers.png';
import piggyPNG from '../../../../assets/img/piggy_bank.png';
import cardPNG from '../../../../assets/img/card.png';
import checkPNG from '../../../../assets/img/check.png';
import Swiper from 'react-native-swiper';
import {Dimensions, Modal, ActivityIndicator, ScrollView} from 'react-native';
import {LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart} from 'react-native-chart-kit';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {generateRandomString, getData, storeData} from '../../../helpers/functions';
import moment from 'moment';
import {apiFunctions, base_ql_http, handleQuery} from '../../../helpers/api';
import {Retry} from '../../../components/retry';
import {useFocusEffect} from '@react-navigation/core';
import {Capitalize, ToastShort} from '../../../helpers/utils';
import {ModalWebView} from '../../../helpers/paystack_webview';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import Logo from '../../../../assets/img/agsLogo_dark.png'
import UpgradePNG from '../../../../assets/img/upgrade.jpeg'


import {FONTSIZE, SAVING_TEST_KEY} from '../../../helpers/constants';
import Autolink from 'react-native-autolink';


const Progress = ({load}) => {
  let interest_fraction = load && load.interest && load.saved ? Number(load.interest) / (Number(load.interest) + Number(load.saved)) : 0;
  let saved_fraction = load && load.interest && load.saved ? load.saved / (Number(load.interest) + Number(load.saved)) : 0;
  return (
    <ProgressChart
      hideLegend={true}
      data={[interest_fraction, saved_fraction]}
      width={Dimensions.get('window').width - 200}
      strokeWidth={8}
      height={150}
      chartConfig={{
        backgroundColor: Colors.primary,
        backgroundGradientFrom: Colors.primary,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: Colors.primary,
        decimalPlaces: 2,
        color: (opacity = 0.5) => `rgba(0, 0, 100, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      style={{
        marginVertical: 0,
        borderRadius: 16,
      }}
    />
  );
};

const Savings = props => {
  const [current, setCurrent] = React.useState('Dashboard');

  const [show, setShow] = React.useState(false);
  const [send_plan, setSendPlan] = React.useState(false);
  const [action, setAction] = React.useState('Transfer');
  const [warning, setWarning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [retry, showRetry] = React.useState(false);
  const [gql_user, setGqlUser] = React.useState(null);
  const [challenges, setChallenges] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [savings, setSavings] = React.useState(null);
  const [plans, setPlans] = React.useState(null);
  const [goals, setGoals] = React.useState(null);

  const [challenge_ids, setChallengeIds] = React.useState(null);
  const [interest, setInterest] = React.useState(0);
  const [display, setDisplay] = React.useState(false);

  const [payload, setPayload] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const transactionHandler = async data => {
    var webResponse = JSON.parse(data);
    setShowModal(false);
    switch (
      webResponse.message //i used paymentStatus here, it might be diff from yours. know the right one to use wen u log out webResponse
    ) {
      case 'USER_CANCELLED':
        {
          setLoading(false);
          setShowModal(false);
        }
        break;
      case 'Approved': {
        try {
          let gql_user = await getData('gql_user');
          let link_data = await getData('link_data');
          let data = {
            amount: link_data.amount / 100,
            reference: `${link_data.reference_id}`,
            type: 'wallet',
            type_id: null,
            user_id: gql_user.id,
            link_card: true,
          };
          console.log('webResponse', webResponse, data);
          let gql_token = await getData('gql_token');
          // verify the ref here by sending it back to the backend
          let response = await axios
            .post(`${base_ql_http}/verify/transaction/`, data, {
              headers: {
                Authorization: `Bearer ${gql_token}`,
              },
            })
            .then(res => {
              setShow(false);
              processData();
            })
            .catch(err => {
              setLoading(false);
              return ToastShort('This should not happen. Please try again');
            });
        } catch (error) {
          console.log('err', error);
          setLoading(false);
          return ToastShort('This should not happen. Please try again');
        }
      }
    }
  };

  const {_updateGqlToken, _updateUser} = useStoreActions(action => ({
    _updateGqlToken: action.userDetails.updateGqlToken,
    _updateUser: action.userDetails.updateUser,
  }));
  const {gql_token, userD, token} = useStoreState(state => ({
    gql_token: state.userDetails.gql_token,
    userD: state.userDetails.user,
    token: state.userDetails.token,
  }));
  const [fetching, setFetching] = React.useState(false);
  const processData = async () => {
    try {
      //check if gql_token is saved and expiry_date isnt now
      showRetry(false);
      setLoading(false);
      const expiry = await getData('gql_token_expiry');
      let userD = await getData('user');
      let gql_token = await getData('gql_token');
      if (gql_token && expiry && moment(new Date()).isBefore(expiry)) {
        return fetchData();
      }
      setLoading(true);
      //check if user has an account, if they dont, register them and log them in.
      if (userD.gql_acc) {
        let query = `mutation{
          strap_user: login(input:{identifier: "${userD.email}", 
            password: "${userD.email}|${userD.id}"
          }){
            jwt
            user{
              id
              email
              username
            }
          }
        }`;
        let res = await handleQuery(query, null);
        storeData('gql_token_expiry', moment(new Date()).add(1.5, 'months'));
        _updateGqlToken(res.data.strap_user.jwt);
        storeData('gql_token', res.data.strap_user.jwt);
        await storeData('q_user', res.data.strap_user.user);
      }
      if (!userD.gql_acc) {
        let query = `mutation {
          register(input:{email: "${userD.email}", 
          password: "${userD.email}|${userD.id}", 
          username: "${userD.email}"
          firstname : "${userD.first_name}"
          lastname : "${userD.last_name}"
        }){
            jwt
            user{
              id
              email
              username
              wallet_balance
            }
          }
        }`;
        let data = {gql_acc: true};
        let res = await handleQuery(query, null);
        let res1 = await apiFunctions.onboarding1(token, userD.id, data);
        storeData('gql_token_expiry', moment(new Date()).add(1.5, 'months'));
        _updateUser(res1);
        _updateGqlToken(res.data.register.jwt);
        storeData('user', res1);
        storeData('gql_token', res.data.register.jwt);
        await storeData('q_user', res.data.register.user);
      }
      fetchData();
      setLoading(false);
    } catch (err) {
      showRetry(true);
    }
  };
  const fetchData = async () => {
    try {
      let gql_user = await getData('q_user');
      let gql_token = await getData('gql_token');
      setFetching(true);
      if (!gql_user) return;
      let query = `query{
        ql_user : users(
            where : {id : ${gql_user.id}}
            sort: "created_at:desc"
          ){
            id
            wallet_balance
            email
            ags_nuban_number
            phone
            user_cards{
              id
            }
            bvn_detail{
              id
            }
            bank_accounts{
              bank_name
              bank_code
              account_name
              account_number
            }
            user_savings_challenges{
              saving_challenges_id{
                id
              }
            }
          }
          challenges : savingChallenges(sort: "created_at:desc"){
            id
            title
            amount_to_be_saved
            maturity_date
            maturity_period
            withdraw_condition
            description
            start_date
            roi
            image
            user_savings_challenges{
              user_id{
                  firstname
                  lastname
              }
            }
          }
        goals_tot_amt : userGoalsConnection(where: {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount_saved
            }
            avg{
              roi
            }
          }
        }

        total_interests : interestsConnection(where : {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount
            }
          }
        }

        
        chall_tot_amt : userSavingsChallengesConnection(where: {user_id : ${gql_user.id}}){
          aggregate{
            sum{
              amount_saved
            }
            avg{
              roi
            }
          }
        }
      } `;

      let res = await handleQuery(query, gql_token);
      let user = res && res.data && res.data.ql_user && res.data.ql_user[0] ? res.data.ql_user[0] : null;
      if (user && !user.phone) {
        setDisplay(true);
        setAction('AddPhone');
      }
      if (user) {
        let challenge_ids =
          user.user_savings_challenges && Array.isArray(user.user_savings_challenges)
            ? user.user_savings_challenges
                .map((item, i) => {
                  return item.saving_challenges_id && item.saving_challenges_id.id ? item.saving_challenges_id.id : null;
                })
                .filter(item => item)
            : [];
        console.log('challenge_ids', challenge_ids);
        setChallengeIds(challenge_ids);
        setGqlUser(user);
        storeData('gql_user', user);
      }
      setChallenges(res.data.challenges);
      let goals_saving = {
        amount_saved:
          res.data && res.data.goals_tot_amt && res.data.goals_tot_amt.aggregate && res.data.goals_tot_amt.aggregate.sum
            ? res.data.goals_tot_amt.aggregate.sum &&
              res.data.goals_tot_amt.aggregate.sum &&
              res.data.goals_tot_amt.aggregate.sum.amount_saved
            : 0,

        avg_roi:
          res.data && res.data.goals_tot_amt && res.data.goals_tot_amt.aggregate && res.data.goals_tot_amt.aggregate.sum
            ? res.data.goals_tot_amt.aggregate.sum && res.data.goals_tot_amt.aggregate.avg && res.data.goals_tot_amt.aggregate.avg.roi
            : 0,
      };
      let interest =
        res.data && res.data.total_interests && res.data.total_interests.aggregate && res.data.total_interests.aggregate.sum
          ? res.data.total_interests.aggregate.sum &&
            res.data.total_interests.aggregate.sum &&
            res.data.total_interests.aggregate.sum.amount
          : 0;
      console.log('interest---', interest, res.data.total_interests);
      setInterest(interest);

      let chall_savings = {
        amount_saved:
          res.data && res.data.chall_tot_amt && res.data.chall_tot_amt.aggregate && res.data.chall_tot_amt.aggregate.sum
            ? res.data.chall_tot_amt.aggregate.sum &&
              res.data.chall_tot_amt.aggregate.sum &&
              res.data.chall_tot_amt.aggregate.sum.amount_saved
            : 0,

        avg_roi:
          res.data && res.data.chall_tot_amt && res.data.chall_tot_amt.aggregate && res.data.chall_tot_amt.aggregate.sum
            ? res.data.chall_tot_amt.aggregate.sum && res.data.chall_tot_amt.aggregate.avg && res.data.chall_tot_amt.aggregate.avg.roi
            : 0,
      };
      setSavings({
        amount_saved: (chall_savings.amount_saved || 0) + (goals_saving.amount_saved || 0) + user.wallet_balance,
        avg_roi: (chall_savings.avg_roi || 0) + (goals_saving.avg_roi || 0),
      });

      setPlans(chall_savings.amount_saved);
      setGoals(goals_saving.amount_saved);
      setFetching(false);
    } catch (err) {
      setFetching(false);
      console.log('err', err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [show]);
  useFocusEffect(
    React.useCallback(() => {
      processData();
    }, []),
  );
  return (
    // <WebView source={{ uri: 'https://beta.herconomy.com' }} />
    <Page backgroundColor={Colors.primary}>
    <Container flex={1}>
        <SizedBox height={5} />
        <Container paddingHorizontal={20}>
            <ImageWrap 
                source={Logo}
                height={30}
                fit="contain"
            />
        </Container>
        <Container backgroundColor={Colors.white} flex={1}
            borderTopLeftRadius={50}
            verticalAlignment="center"
            borderTopRightRadius={50}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <SizedBox height={5}/>
                {/* <ImageWrap 
                    height={30}
                    source={UpgradePNG}
                    fit="contain"
                /> */}
                <Container 
                    paddingHorizontal={5} marginTop={4}
                    //  horizontalAlignment="center"
                >
                    {/* <H1 fontSize={18} textAlign="center" >Savings </H1> */}
                    <SizedBox height={2}/>
                    <P textAlign="left">Dear {userD.first_name}!</P>
                    <SizedBox height={2}/>

                    <P textAlign="left">Guess what! Our Savings is on  the web now! We hope you're excited to experience all our amazing offerings! We've got you covered. High interest, Multiple saving options and No charges.
Come take a look!</P>


    
                    <SizedBox height={5}/>

                    <Container
                     horizontalAlignment="center"

                    >

                    <Button title="Start Saving Now! " 
                        textAlign="center"

                        widthPercent="70%"
                        backgroundColor={Colors.primary}
                        borderColor={Colors.primary}
                        onPress={()=>Linking.openURL('https://dashboard.herconomy.com/')}
                    />

</Container>

                    <SizedBox height={5}/>
                </Container>
            </ScrollView>
        </Container>
    </Container>
</Page>
  );
};

export default Savings;
