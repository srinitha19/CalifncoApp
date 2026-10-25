import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';

import { auth, db } from './firebase';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
  

import {
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
} from 'firebase/firestore';
  
const purifierRO = require('./assets/purifier-ro.jpg');
const purifierUV = require('./assets/purifier.uv.jpg');
const purifierCompact = require('./assets/purifier-compact.jpg');
const PRODUCTS = [
    {
      id: '1',
      name: 'AquaPure RO',
      type: 'RO Water Purifier',
      price: 12999,
      emoji: '💧',
      imageUrl: 'https://placehold.co/400x300/eaf6ff/164e78?text=Water+Purifier',      description: 'A reverse osmosis purifier for everyday household use.',
      features: ['RO purification', 'Modern design', 'Household use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '2',
      name: 'PureFlow Max',
      type: 'RO + UV Purifier',
      price: 15999,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'A purifier combining RO and UV purification technologies.',
      features: ['RO + UV purification', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '3',
      name: 'Crystal Fresh',
      type: 'UV Water Purifier',
      price: 8999,
      emoji: '✨',
      category: 'UV',
      description: 'A compact UV purifier for everyday household needs.',
      features: ['UV purification', 'Compact design', 'Daily use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '4',
      name: 'AquaShield Pro',
      type: 'RO + UV + UF Purifier',
      price: 18999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A purifier combining RO, UV and UF filtration technologies.',
      features: ['RO + UV + UF', 'Multi-stage filtration', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '5',
      name: 'PureDrop Classic',
      type: 'RO Water Purifier',
      price: 10999,
      emoji: '💧',
      category: 'RO',
      description: 'A classic RO purifier design for home kitchens.',
      features: ['RO purification', 'Compact design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '6',
      name: 'HydroCare UV',
      type: 'UV Water Purifier',
      price: 7999,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier with a simple, space-saving design.',
      features: ['UV purification', 'Space-saving design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '7',
      name: 'AquaNova Plus',
      type: 'RO + UV Purifier',
      price: 16999,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'An RO and UV purifier for household water treatment.',
      features: ['RO + UV', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '8',
      name: 'ClearSpring UF',
      type: 'UF Water Purifier',
      price: 5999,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration option for suitable household water sources.',
      features: ['UF filtration', 'Simple design', 'Easy operation'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '9',
      name: 'AquaElite',
      type: 'RO + UV + UF Purifier',
      price: 19999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A multi-stage purifier with RO, UV and UF technologies.',
      features: ['RO + UV + UF', 'Multi-stage treatment', 'Premium design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '10',
      name: 'FreshWave RO',
      type: 'RO Water Purifier',
      price: 11999,
      emoji: '💧',
      category: 'RO',
      description: 'An everyday RO purifier for residential use.',
      features: ['RO purification', 'Wall-mount style', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '11',
      name: 'PureWave UV',
      type: 'UV Water Purifier',
      price: 8499,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purification option with a contemporary design.',
      features: ['UV purification', 'Modern design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '12',
      name: 'HydroMax RO',
      type: 'RO Water Purifier',
      price: 13999,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier for everyday residential water treatment.',
      features: ['RO purification', 'Multi-stage filtration', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '13',
      name: 'CrystalGuard',
      type: 'RO + UV Purifier',
      price: 17499,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A combination RO and UV purifier for home kitchens.',
      features: ['RO + UV', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '14',
      name: 'PureSpring UF',
      type: 'UF Water Purifier',
      price: 6499,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration product for suitable water conditions.',
      features: ['UF filtration', 'Compact build', 'Simple operation'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '15',
      name: 'AquaSmart RO',
      type: 'RO Water Purifier',
      price: 14999,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a contemporary household design.',
      features: ['RO purification', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '16',
      name: 'BlueStream UV',
      type: 'UV Water Purifier',
      price: 9299,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier designed for convenient residential use.',
      features: ['UV purification', 'Compact styling', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '17',
      name: 'AquaFusion',
      type: 'RO + UV + UF Purifier',
      price: 20999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A multi-technology water purifier for household use.',
      features: ['RO + UV + UF', 'Multiple filtration stages', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '18',
      name: 'PureLife RO',
      type: 'RO Water Purifier',
      price: 12499,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier for regular home water treatment.',
      features: ['RO purification', 'Space-saving style', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '19',
      name: 'ClearView UV',
      type: 'UV Water Purifier',
      price: 8799,
      emoji: '✨',
      category: 'UV',
      description: 'A compact UV purification product for home installation.',
      features: ['UV purification', 'Compact design', 'Easy operation'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '20',
      name: 'HydroPure Max',
      type: 'RO + UV Purifier',
      price: 16499,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'An RO and UV purifier with a clean modern appearance.',
      features: ['RO + UV', 'Multi-stage treatment', 'Home use'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '21',
      name: 'AquaComfort',
      type: 'RO Water Purifier',
      price: 13499,
      emoji: '💧',
      category: 'RO',
      description: 'A household RO purifier with a practical design.',
      features: ['RO purification', 'Practical design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '22',
      name: 'PureShield UV',
      type: 'UV Water Purifier',
      price: 9499,
      emoji: '🛡️',
      category: 'UV',
      description: 'A UV purifier for compatible household water supplies.',
      features: ['UV purification', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '23',
      name: 'AquaPrime',
      type: 'RO + UV + UF Purifier',
      price: 21999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A purifier combining three filtration technologies.',
      features: ['RO + UV + UF', 'Multi-stage filtration', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '24',
      name: 'FreshFlow UF',
      type: 'UF Water Purifier',
      price: 6999,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration product for appropriate water conditions.',
      features: ['UF filtration', 'Simple design', 'Home use'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '25',
      name: 'AquaComfort Plus',
      type: 'RO Water Purifier',
      price: 15499,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a contemporary finish.',
      features: ['RO purification', 'Multi-stage treatment', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '26',
      name: 'CrystalWave',
      type: 'RO + UV Purifier',
      price: 17999,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'A combination RO and UV purifier for residential settings.',
      features: ['RO + UV', 'Modern design', 'Home use'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '27',
      name: 'HydroFresh UV',
      type: 'UV Water Purifier',
      price: 8999,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier with a compact footprint.',
      features: ['UV purification', 'Compact design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '28',
      name: 'PureGuard RO',
      type: 'RO Water Purifier',
      price: 14499,
      emoji: '🛡️',
      category: 'RO',
      description: 'An RO purifier for everyday household water treatment.',
      features: ['RO purification', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '29',
      name: 'AquaHarmony',
      type: 'RO + UV + UF Purifier',
      price: 22999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A multi-stage purifier combining RO, UV and UF.',
      features: ['RO + UV + UF', 'Multi-stage filtration', 'Home use'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '30',
      name: 'PureSpring RO',
      type: 'RO Water Purifier',
      price: 11499,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a simple household-friendly design.',
      features: ['RO purification', 'Compact design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '31',
      name: 'BlueCrystal UV',
      type: 'UV Water Purifier',
      price: 9799,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier for suitable water sources and installations.',
      features: ['UV purification', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '32',
      name: 'AquaAdvance',
      type: 'RO + UV Purifier',
      price: 18499,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'A combination purifier with RO and UV technology.',
      features: ['RO + UV', 'Multi-stage treatment', 'Home use'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '33',
      name: 'ClearDrop UF',
      type: 'UF Water Purifier',
      price: 7499,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration option for appropriate water conditions.',
      features: ['UF filtration', 'Compact design', 'Easy operation'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '34',
      name: 'AquaSignature',
      type: 'RO Water Purifier',
      price: 16999,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a premium-inspired appearance.',
      features: ['RO purification', 'Contemporary design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '35',
      name: 'PureFusion Max',
      type: 'RO + UV + UF Purifier',
      price: 23999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A purifier with three filtration technologies.',
      features: ['RO + UV + UF', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '36',
      name: 'HydroFlow RO',
      type: 'RO Water Purifier',
      price: 12499,
      emoji: '💧',
      category: 'RO',
      description: 'An everyday RO purifier for household installation.',
      features: ['RO purification', 'Space-saving design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '37',
      name: 'CrystalClear UV',
      type: 'UV Water Purifier',
      price: 10499,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier with a contemporary household design.',
      features: ['UV purification', 'Compact design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '38',
      name: 'AquaBalance',
      type: 'RO + UV Purifier',
      price: 19499,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'An RO and UV purifier for suitable home water supplies.',
      features: ['RO + UV', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '39',
      name: 'PureComfort UF',
      type: 'UF Water Purifier',
      price: 7999,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration option for suitable water conditions.',
      features: ['UF filtration', 'Simple design', 'Home use'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '40',
      name: 'AquaLegend RO',
      type: 'RO Water Purifier',
      price: 17999,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a refined contemporary appearance.',
      features: ['RO purification', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '41',
      name: 'FreshGuard UV',
      type: 'UV Water Purifier',
      price: 9999,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier for compatible residential water sources.',
      features: ['UV purification', 'Modern design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '42',
      name: 'AquaInfinity',
      type: 'RO + UV + UF Purifier',
      price: 24999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A multi-technology purifier with three filtration methods.',
      features: ['RO + UV + UF', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '43',
      name: 'PureChoice RO',
      type: 'RO Water Purifier',
      price: 13499,
      emoji: '💧',
      category: 'RO',
      description: 'A practical RO purifier for everyday home use.',
      features: ['RO purification', 'Compact design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '44',
      name: 'ClearWater UV',
      type: 'UV Water Purifier',
      price: 10999,
      emoji: '✨',
      category: 'UV',
      description: 'A UV purifier designed for suitable household installations.',
      features: ['UV purification', 'Contemporary design', 'Home use'],
      specifications: [['Purification', 'UV'], ['Usage', 'Home']],
    },
    {
      id: '45',
      name: 'HydroFusion',
      type: 'RO + UV Purifier',
      price: 20499,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'A combination RO and UV purifier for residential use.',
      features: ['RO + UV', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
    {
      id: '46',
      name: 'PureNest UF',
      type: 'UF Water Purifier',
      price: 8499,
      emoji: '🌊',
      category: 'UF',
      description: 'A UF filtration product for appropriate household water.',
      features: ['UF filtration', 'Compact design', 'Home use'],
      specifications: [['Purification', 'UF'], ['Usage', 'Home']],
    },
    {
      id: '47',
      name: 'AquaRoyal',
      type: 'RO Water Purifier',
      price: 18999,
      emoji: '💧',
      category: 'RO',
      description: 'An RO purifier with a premium-inspired exterior.',
      features: ['RO purification', 'Modern styling', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '48',
      name: 'CrystalFusion',
      type: 'RO + UV + UF Purifier',
      price: 25999,
      emoji: '🛡️',
      category: 'RO + UV',
      description: 'A multi-stage purifier combining RO, UV and UF technology.',
      features: ['RO + UV + UF', 'Multi-stage filtration', 'Modern design'],
      specifications: [['Purification', 'RO + UV + UF'], ['Usage', 'Home']],
    },
    {
      id: '49',
      name: 'AquaEveryday',
      type: 'RO Water Purifier',
      price: 11999,
      emoji: '💧',
      category: 'RO',
      description: 'An everyday RO purifier for home water treatment.',
      features: ['RO purification', 'Simple design', 'Home use'],
      specifications: [['Purification', 'RO'], ['Usage', 'Home']],
    },
    {
      id: '50',
      name: 'PureFuture Max',
      type: 'RO + UV Purifier',
      price: 21499,
      emoji: '🚰',
      category: 'RO + UV',
      description: 'A contemporary purifier combining RO and UV technologies.',
      features: ['RO + UV', 'Multi-stage treatment', 'Modern design'],
      specifications: [['Purification', 'RO + UV'], ['Usage', 'Home']],
    },
];

const getProductImage = (product) => {
  const text = `${product.name} ${product.type} ${product.category || ''}`.toLowerCase();

  if (text.includes('uv')) {
    return purifierUV;
  }

  if (
    text.includes('compact') ||
    text.includes('portable') ||
    text.includes('countertop') ||
    text.includes('uf')
  ) {
    return purifierCompact;
  }

  return purifierRO;
};

const getDealerPrice = (product) =>
    Math.round(product.price * 0.75);
  

const CATEGORIES = ['All', 'RO', 'RO + UV', 'UV'];
const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const showAppAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [mySupportRequests, setMySupportRequests] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePhone, setServicePhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [supportName, setSupportName] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dealerApplications, setDealerApplications] = useState([]);
  const [dealerStatus, setDealerStatus] = useState('none');
  const [lastOrder, setLastOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const [accounts, setAccounts] = useState([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(
            doc(db, 'users', firebaseUser.uid)
          );
  
          const userData = userDoc.exists()
            ? userDoc.data()
            : {};

          setCart(Array.isArray(userData.cart) ? userData.cart : []);
  
          const name =
            userData.name || firebaseUser.displayName || firebaseUser.email || 'User';
  
          const phone = userData.phone || '';
  
          setCurrentUser({
            name,
            phone,
            email: firebaseUser.email || '',
          });
  
          setCustomerName(name);
          setPhone(phone);
          setActiveTab('Profile');
        } catch (error) {
          console.error('Error restoring login:', error);
  
          setCurrentUser({
            name: firebaseUser.displayName || firebaseUser.email || 'User',
            phone: '',
            email: firebaseUser.email || '',
          });
  
          setActiveTab('Profile');
        }
      } else {
        setCurrentUser(null);
        setCart([]);
        setActiveTab('Login');
      }
    });
  
    return unsubscribe;
  }, []);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsAdmin(false);
        return;
      }
  
      try {
        const adminDoc = await getDoc(
          doc(db, 'admin', firebaseUser.uid)
        );
  
        setIsAdmin(
          adminDoc.exists() && adminDoc.data().role === 'admin'
        );
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
      }
    });
  
    return unsubscribe;
  }, []);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setDealerStatus('none');
        return;
      }
  
      try {
        const applicationDoc = await getDoc(
          doc(db, 'dealerApplications', firebaseUser.uid)
        );
  
        if (applicationDoc.exists()) {
          setDealerStatus(applicationDoc.data().status || 'none');
        } else {
          setDealerStatus('none');
        }
      } catch (error) {
        console.error('Dealer status check failed:', error);
        setDealerStatus('none');
      }
    });
  
    return unsubscribe;
  }, []);
  
  
  useEffect(() => {
    setAccountsLoaded(true);
  }, []);

  useEffect(() => {
    if (activeTab === 'MyOrders' && auth.currentUser) {
      loadMyOrders();
    }
  }, [activeTab, currentUser]);
  
  
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 1000 ? 0 : 99;
  const total = subtotal + delivery;

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.type.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  

 
const addToCart = async (product) => {
  try {
    if (!auth.currentUser) {
      showAppAlert(
        'Login Required',
        'Please log in before adding products to your saved cart.'
      );
      return;
    }

    const cartProduct = {
      ...product,
      price:
        dealerStatus === 'approved'
          ? getDealerPrice(product)
          : product.price,
    };

    const existing = cart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...cartProduct, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        { ...cartProduct, quantity: 1 },
      ];
    }

    setCart(updatedCart);

    const firestoreCart = updatedCart.map((item) => {
      const safeItem = {};

      Object.entries(item).forEach(([key, value]) => {
        safeItem[key] = Array.isArray(value)
          ? JSON.stringify(value)
          : value;
      });

      return safeItem;
    });

    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      { cart: firestoreCart },
      { merge: true }
    );

    showAppAlert(
      'Added to Cart',
      `${product.name} added successfully.`
    );
  } catch (error) {
    console.error('Add to cart error:', error.code, error.message);

    showAppAlert(
      'Cart Error',
      `${error.code || 'Error'}: ${error.message || 'Could not save your cart.'}`
    );
  }
};

  


  const removeFromCart = async (productId) => {
    try {
        const updatedCart = cart.filter(
            (item) => item.id !== productId
        );

        setCart(updatedCart);

        if (auth.currentUser) {
            const firestoreCart = updatedCart.map((item) => {
                const safeItem = {};

                Object.entries(item).forEach(([key, value]) => {
                    safeItem[key] = Array.isArray(value)
                        ? JSON.stringify(value)
                        : value;
                });

                return safeItem;
            });

            await setDoc(
                doc(db, 'users', auth.currentUser.uid),
                { cart: firestoreCart },
                { merge: true }
            );
        }
    } catch (error) {
      console.error('Remove cart item error:', error.code, error.message);
      showAppAlert('Cart Error', 'Could not remove the product from Firebase.');
    }
};

  

  const buyNow = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setActiveTab('Checkout');
  };

  const changeQuantity = async (productId, change) => {
    try {
      const updatedCart = cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0);
  
      setCart(updatedCart);
  
      if (auth.currentUser) {
        const firestoreCart = updatedCart.map((item) => {
          const safeItem = {};
  
          Object.entries(item).forEach(([key, value]) => {
            safeItem[key] = Array.isArray(value)
              ? JSON.stringify(value)
              : value;
          });
  
          return safeItem;
        });
  
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { cart: firestoreCart },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Quantity update error:', error.code, error.message);
      showAppAlert('Cart Error', 'Could not update your cart in Firebase.');
    }
  };


// LOGIN

const handleLogin = async () => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;
  
    if (!email || !password) {
      showAppAlert('Missing Details', 'Enter your email and password.');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const firebaseUser = userCredential.user;
  
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
  
      const name = userData.name || firebaseUser.displayName || email;
      const phone = userData.phone || '';
  
      setCurrentUser({
        name,
        phone,
        email: firebaseUser.email || email,
      });
  
      setCustomerName(name);
      setPhone(phone);
      setLoginPassword('');
      setActiveTab('Profile');
  
      showAppAlert('Login Successful', `Welcome back, ${name}!`);
    } catch (error) {
      console.error('Firebase login error:', error.code, error.message);
  
      let message = 'Unable to log in. Please try again.';
  
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'Incorrect email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }
  
      showAppAlert('Login Failed', message);
    }
};
  
  

// SIGNUP 
const handleSignup = async () => {
    const name = signupName.trim();
    const phoneNumber = signupPhone.trim();
    const email = signupEmail.trim().toLowerCase();
    const password = signupPassword;
  
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !password ||
      !signupConfirmPassword
    ) {
      showAppAlert('Missing Details', 'Please fill in all signup fields.');
      return;
    }
  
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      showAppAlert('Invalid Phone', 'Enter a valid 10-digit Indian mobile number.');
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAppAlert('Invalid Email', 'Enter a valid email address.');
      return;
    }
  
    if (password.length < 6) {
      showAppAlert('Weak Password', 'Password must contain at least 6 characters.');
      return;
    }
  
    if (password !== signupConfirmPassword) {
      showAppAlert('Password Mismatch', 'Your passwords do not match.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const firebaseUser = userCredential.user;
  
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        phone: phoneNumber,
        email,
        createdAt: new Date().toISOString(),
      });
  
      setCurrentUser({
        name,
        phone: phoneNumber,
        email,
      });
  
      setCustomerName(name);
      setPhone(phoneNumber);
  
      setSignupName('');
      setSignupPhone('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
  
      setActiveTab('Profile');
  
      showAppAlert('Signup Successful', `Welcome to Califnco, ${name}!`);
    } catch (error) {
      console.error('Firebase signup error:', error.code, error.message);
  
      let message = 'Your account could not be created. Please try again.';
  
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please log in.';
        setLoginEmail(email);
        setActiveTab('Login');
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Please choose a stronger password.';
      } else if (error.code === 'permission-denied') {
        message = 'Database permission denied. Please check Firestore rules.';
      }
  
      showAppAlert('Signup Failed', message);
    }
};


// LOGOUT

const handleLogout = async () => {
    try {
      await signOut(auth);
  
      setCurrentUser(null);
      setLoginEmail('');
      setLoginPassword('');
      setActiveTab('Login');
  
      showAppAlert('Logged Out', 'You have been logged out of Califnco.');
    } catch (error) {
      console.error('Firebase logout error:', error.code, error.message);
      showAppAlert('Logout Failed', error.message);
    }
};



const loadMyOrders = async () => {
    if (!auth.currentUser) {
      setOrders([]);
      return;
    }
  
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', auth.currentUser.uid)
      );
  
      const snapshot = await getDocs(ordersQuery);
  
      const firebaseOrders = snapshot.docs.map((orderDoc) => ({
        ...orderDoc.data(),
        firestoreId: orderDoc.id,
      }));
  
      firebaseOrders.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  
      setOrders(firebaseOrders);
    } catch (error) {
      console.error('Load orders error:', error.code, error.message);
      showAppAlert('Orders Error', 'Could not load your order history.');
    }
};



const loadAdminOrders = async () => {
    if (!auth.currentUser || !isAdmin) {
      return;
    }
  
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
  
      const allOrders = snapshot.docs.map((orderDoc) => ({
        ...orderDoc.data(),
        firestoreId: orderDoc.id,
      }));
  
      allOrders.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  
      setOrders(allOrders);
    } catch (error) {
      console.error(
        'Admin orders error:',
        error.code,
        error.message
      );
  
      showAppAlert(
        'Error',
        'Could not load orders. Please try again.'
      );
    }
};

const submitDealerApplication = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      showAppAlert('Login required', 'Please log in first.');
      return;
    }
  
    try {
      const applicationRef = doc(db, 'dealerApplications', user.uid);
      const existingApplication = await getDoc(applicationRef);
  
      if (existingApplication.exists()) {
        showAppAlert(
          'Application already submitted',
          `Current status: ${existingApplication.data().status}`
        );
        return;
      }
  
      await setDoc(applicationRef, {
        userId: user.uid,
        name: currentUser?.name || '',
        email: user.email || '',
        phone: currentUser?.phone || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
  
      showAppAlert(
        'Application submitted',
        'Your dealer application has been sent to the admin for approval.'
      );
    } catch (error) {
      console.error('Dealer application error:', error.code, error.message);
      showAppAlert(
        'Submission failed',
        'Could not submit your application. Please try again.'
      );
    }
};

const updateOrderStatus = async (orderId, newStatus) => {
    console.log('Update clicked:', orderId, newStatus);
  
    if (!auth.currentUser || !isAdmin) {
      showAppAlert('Access denied', 'Admin access is required.');
      return;
    }
  
    if (!orderId) {
      showAppAlert('Error', 'Order ID is missing.');
      return;
    }
  
    const allowedStatuses = ['Processing', 'Shipped', 'Delivered'];
  
    if (!allowedStatuses.includes(newStatus)) {
      showAppAlert('Error', 'Invalid order status.');
      return;
    }
  
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
      });
  
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.firestoreId === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
  
      showAppAlert(
        'Success',
        `Order status updated to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        'Order update failed:',
        error.code,
        error.message
      );
  
      showAppAlert(
        'Update failed',
        error.message || 'Could not update order status.'
      );
    }
  };
  
  

// PLACE ORDER AND ADD IT TO MY ORDERS
const placeOrder = async () => {
  if (cart.length === 0) {
    showAppAlert('Empty Cart', 'Please add a product first.');
    return;
  }

  const name = (currentUser?.name || customerName).trim();
  const mobile = (currentUser?.phone || phone).trim();

  if (!name) {
    showAppAlert('Name Required', 'Please enter your name in checkout.');
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    showAppAlert(
      'Invalid Phone',
      'Enter a valid 10-digit Indian mobile number.'
    );
    return;
  }

  if (address.trim().length < 10) {
    showAppAlert(
      'Address Required',
      'Enter your complete delivery address.'
    );
    return;
  }

  if (!auth.currentUser) {
    showAppAlert('Login Required', 'Please log in before placing an order.');
    return;
  }

  try {
    const firestoreItems = cart.map((item) => {
      const safeItem = {};

      Object.entries(item).forEach(([key, value]) => {
        safeItem[key] = Array.isArray(value)
          ? JSON.stringify(value)
          : value;
      });

      return safeItem;
    });

    
  const order = {
    orderNumber: `CAL${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-IN'),
    createdAt: new Date().toISOString(),
    userId: auth.currentUser.uid,
    customerName: name,
    phone: mobile,
    address: address.trim(),
    email: auth.currentUser.email || null,

    customerType:
      dealerStatus === 'approved' && !isAdmin
        ? 'Dealer'
        : 'Retail',

    items: firestoreItems,
    total,
    status: 'Processing',
  };


    // Save the order to Firestore first.
    await addDoc(collection(db, 'orders'), order);

    // Update the app only after the order has been saved.
    setOrders((currentOrders) => [order, ...currentOrders]);
    setLastOrder(order);

    // Clear the saved cart in Firestore.
    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      { cart: [] },
      { merge: true }
    );

    setCart([]);
    setActiveTab('OrderSuccess');

    showAppAlert(
      'Order Placed!',
      `Your order ${order.orderNumber} has been saved successfully.`
    );
  } catch (error) {
    console.error('Place order error:', error.code, error.message);

    showAppAlert(
      'Order Error',
      `${error.code || 'Error'}: ${error.message || 'Could not complete your order.'}`
    );
  }
};


  const openProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('ProductDetails');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setActiveTab('Home')}>
        <Text style={styles.logo}>Califnco</Text>
        <Text style={styles.logoCaption}>PURE WATER. BETTER LIVING.</Text>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => setActiveTab(currentUser ? 'Profile' : 'Login')}
        >
          <Text style={styles.headerIconText}>👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCart}
          onPress={() => setActiveTab('Cart')}
        >
          <Text style={styles.headerCartText}>🛒 {cartCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryRow}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  
const renderProductCard = (product) => (
  <View key={product.id} style={styles.productCard}>
    <TouchableOpacity
      style={styles.productImage}
      onPress={() => openProduct(product)}
    >
      <Image
        source={getProductImage(product)}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </TouchableOpacity>

    <Text style={styles.productType}>{product.type}</Text>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>
      {money(
        dealerStatus === 'approved' && !isAdmin
          ? getDealerPrice(product)
          : product.price
      )}
    </Text>

    <TouchableOpacity
      style={styles.detailsButton}
      onPress={() => openProduct(product)}
    >
      <Text style={styles.detailsButtonText}>View Details</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.primaryButton}
      onPress={() => addToCart(product)}
    >
      <Text style={styles.primaryButtonText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
);


  const renderHome = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>WELCOME TO CALIFNCO</Text>
        <Text style={styles.heroTitle}>Pure Water,{'\n'}Pure Happiness.</Text>
        <Text style={styles.heroDescription}>
          Find the right water purifier for your home.
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => setActiveTab('Categories')}
        >
          <Text style={styles.heroButtonText}>Explore Purifiers →</Text>
        </TouchableOpacity>

        <Text style={styles.heroEmoji}>💧</Text>
      </View>

      <View style={styles.benefitRow}>
        {[
          ['🛡️', 'Quality Focus'],
          ['🚚', 'Easy Delivery'],
          ['🔧', 'Service Support'],
        ].map(([emoji, label]) => (
          <View key={label} style={styles.benefitItem}>
            <Text style={styles.benefitEmoji}>{emoji}</Text>
            <Text style={styles.benefitText}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Your Purifier</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search purifiers..."
          placeholderTextColor="#7A8C98"
          value={search}
          onChangeText={setSearch}
        />

        {renderCategories()}

        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <Text style={styles.mutedText}>{filteredProducts.length} products</Text>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map(renderProductCard)}
        </View>

        {filteredProducts.length === 0 && (
          <Text style={styles.emptyText}>No matching products found.</Text>
        )}
      </View>

      {renderServiceCard()}
    </ScrollView>
  );

  const renderCategoriesPage = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Our Purifiers</Text>
      <Text style={styles.pageSubtitle}>Choose a purifier for your home.</Text>
      {renderCategories()}

      <View style={styles.productGrid}>
        {filteredProducts.map(renderProductCard)}
      </View>

      {filteredProducts.length === 0 && (
        <Text style={styles.emptyText}>No matching products found.</Text>
      )}
    </ScrollView>
  );

  const renderProductDetails = () => {
    if (!selectedProduct) {
      return (
        <View style={styles.pageContent}>
          <Text style={styles.pageTitle}>Product not found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const product = selectedProduct;

    return (
      <ScrollView contentContainerStyle={styles.detailsPage}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveTab('Home')}
        >
          <Text style={styles.backButtonText}>← Back to Shopping</Text>
        </TouchableOpacity>

        <View style={styles.detailsHero}>
          <Image
            source={getProductImage(product)}
            style={styles.detailsProductImage}
            resizeMode="contain"
          />
          <View style={styles.detailsTag}>
            <Text style={styles.detailsTagText}>
              {product.category || product.type} SERIES
            </Text>
            </View>
        </View>

        <Text style={styles.detailsType}>{product.type}</Text>
        <Text style={styles.detailsName}>{product.name}</Text>
        <Text style={styles.detailsPrice}>
          {money(
            dealerStatus === 'approved' && !isAdmin
              ? getDealerPrice(product)
              : product.price
          )}
        </Text>        
        <Text style={styles.taxNote}>Sample price for this demo app.</Text>

        <Text style={styles.sectionTitle}>About this product</Text>
        <Text style={styles.bodyText}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Key Features</Text>
        {product.features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specCard}>
          {product.specifications.map(([label, value]) => (
            <View key={label} style={styles.specRow}>
              <Text style={styles.specLabel}>{label}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Confirm actual specifications and warranty with the seller before purchasing.
        </Text>

        <TouchableOpacity
          style={styles.primaryButtonLarge}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.primaryButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => buyNow(product)}
        >
          <Text style={styles.buyNowButtonText}>Buy Now →</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderCart = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>My Cart</Text>
      <Text style={styles.pageSubtitle}>Review your selected products.</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.mutedText}>Add a purifier to get started.</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartEmojiBox}>
                <Text style={styles.cartEmoji}>{item.emoji}</Text>
              </View>
              
              <View style={styles.cartInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.mutedText}>{item.type}</Text>
                <Text style={styles.productPrice}>
                  {money(item.price * item.quantity)}
                </Text>

                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => changeQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => changeQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {renderPriceSummary()}

          <TouchableOpacity
            style={styles.primaryButtonLarge}
            onPress={() => setActiveTab('Checkout')}
          >
            <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderPriceSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Price Details</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{money(subtotal)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={styles.summaryValue}>
          {delivery === 0 ? 'FREE' : money(delivery)}
        </Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{money(total)}</Text>
      </View>
    </View>
  );

  const renderCheckout = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setActiveTab('Cart')}
      >
        <Text style={styles.backButtonText}>← Back to Cart</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Checkout</Text>
      <Text style={styles.pageSubtitle}>Enter your delivery details.</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No products to checkout</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Delivery Details</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your name"
              placeholderTextColor="#7A8C98"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.formInput}
              placeholder="10-digit mobile number"
              placeholderTextColor="#7A8C98"
              value={phone}
              onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.inputLabel}>Delivery Address</Text>
            <TextInput
              style={[styles.formInput, styles.addressInput]}
              placeholder="House, street, area, city and PIN code"
              placeholderTextColor="#7A8C98"
              value={address}
              onChangeText={setAddress}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            {cart.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={styles.summaryValue}>
                  {money(item.price * item.quantity)}
                </Text>
              </View>
            ))}

            {renderPriceSummary()}
          </View>

          <Text style={styles.disclaimer}>
            Demo checkout only. No payment will be collected.
          </Text>

          <TouchableOpacity
            style={styles.primaryButtonLarge}
            onPress={placeOrder}
          >
            <Text style={styles.primaryButtonText}>Place Demo Order</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderOrderSuccess = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <View style={styles.successCard}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successDescription}>
          Thank you for choosing Califnco. Your demo order has been created.
        </Text>

        {lastOrder && (
          <>
            <View style={styles.orderNumberBox}>
              <Text style={styles.mutedText}>Order Number</Text>
              <Text style={styles.orderNumber}>{lastOrder.orderNumber}</Text>
              <Text style={styles.mutedText}>Order date: {lastOrder.date}</Text>
              <Text style={styles.orderStatusText}>Status: {lastOrder.status}</Text>
            </View>

            <View style={styles.orderInfo}>
              <Text style={styles.formTitle}>Delivery Details</Text>
              <Text style={styles.bodyText}>{lastOrder.customerName}</Text>
              <Text style={styles.bodyText}>{lastOrder.phone}</Text>
              <Text style={styles.bodyText}>{lastOrder.address}</Text>
            </View>

            <View style={styles.orderInfo}>
              <Text style={styles.formTitle}>Items Ordered</Text>

              {lastOrder.items.map((item) => (
                <View key={item.id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.summaryValue}>
                    {money(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{money(lastOrder.total)}</Text>
              </View>

              <Text style={styles.disclaimer}>
                Demo order only. No real payment or delivery booking was made.
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.primaryButtonLarge}
          onPress={() => setActiveTab('MyOrders')}
        >
          <Text style={styles.primaryButtonText}>View My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setSearch('');
            setSelectedCategory('All');
            setActiveTab('Home');
          }}
        >
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  
  
const renderOrderTracking = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
  
    const currentStep = steps.indexOf(status);
  
    if (status === 'Cancelled') {
      return (
        <View
          style={{
            backgroundColor: '#FDECEC',
            padding: 12,
            borderRadius: 10,
            marginVertical: 12,
          }}
        >
          <Text style={{ color: '#B42318', fontWeight: 'bold' }}>
            Order Cancelled
          </Text>
        </View>
      );
    }
  
    return (
      <View style={{ marginVertical: 16 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: '#163B50',
            marginBottom: 16,
          }}
        >
          Order Tracking
        </Text>
  
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {steps.map((step, index) => {
            const completed = currentStep >= index;
  
            return (
              <View
                key={step}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: completed ? '#16866A' : '#DCE4E8',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                    {completed ? '✓' : index + 1}
                  </Text>
                </View>
  
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 7,
                    textAlign: 'center',
                    color: completed ? '#16866A' : '#7A8C98',
                    fontWeight: completed ? 'bold' : 'normal',
                  }}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
  
        <Text
          style={{
            color: '#526875',
            fontSize: 13,
            marginTop: 12,
          }}
        >
          Current status: {status || 'Processing'}
        </Text>
      </View>
    );
  };
  


  // NEW MY ORDERS PAGE
  const renderMyOrders = () => {
    const myOrders = orders.filter(
        (order) => order.userId === auth.currentUser?.uid
    );

    return (
      <ScrollView contentContainerStyle={styles.pageContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveTab('Profile')}
        >
          <Text style={styles.backButtonText}>← Back to Profile</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>My Orders</Text>
        <Text style={styles.pageSubtitle}>
          View your order history and purchase details.
        </Text>

        {myOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.mutedText}>
              Your placed orders will appear here.
            </Text>

            <TouchableOpacity
              style={styles.primaryButtonLarge}
              onPress={() => setActiveTab('Home')}
            >
              <Text style={styles.primaryButtonText}>Explore Purifiers</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myOrders.map((order) => (
            <View key={order.orderNumber} style={styles.myOrderCard}>
              <View style={styles.myOrderHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.mutedText}>Ordered on {order.date}</Text>
                </View>

                <View style={styles.orderStatusBadge}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>

              
              <View style={styles.summaryDivider} />

              {renderOrderTracking(order.status)}

              <Text style={styles.formTitle}>Items Ordered</Text>


              {order.items.map((item, index) => (
                <View
                  key={`${order.orderNumber}-${item.id}-${index}`}
                  style={styles.myOrderItem}
                >
                  <Text style={styles.myOrderEmoji}>{item.emoji}</Text>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.mutedText}>{item.type}</Text>
                    <Text style={styles.mutedText}>
                      Quantity: {item.quantity}
                    </Text>
                  </View>

                  <Text style={styles.summaryValue}>
                    {money(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>{money(order.total)}</Text>
              </View>

              <View style={styles.orderDeliveryInfo}>
                <Text style={styles.formTitle}>Delivery Details</Text>
                <Text style={styles.bodyText}>{order.customerName}</Text>
                <Text style={styles.bodyText}>{order.phone}</Text>
                <Text style={styles.bodyText}>{order.address}</Text>
              </View>

              <Text style={styles.disclaimer}>
                Demo order only. No real payment or delivery booking was made.
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setActiveTab('Home')}
        >
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    );

};


const renderAdminServiceRequests = () => (
  <ScrollView contentContainerStyle={styles.pageContent}>
    <Text style={styles.pageTitle}>Service Requests</Text>

    <Text style={styles.pageSubtitle}>
      View customer installation requests.
    </Text>

    {!isAdmin ? (
      <View style={styles.profileCard}>
        <Text style={styles.formTitle}>Access denied</Text>
        <Text style={styles.bodyText}>
          Only an authorized administrator can view service requests.
        </Text>
      </View>
    ) : (
      <>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={loadAdminServiceRequests}
        >
          <Text style={styles.secondaryButtonText}>
            Refresh Requests
          </Text>
        </TouchableOpacity>

        {serviceRequests.length === 0 ? (
          <View style={styles.profileCard}>
            <Text style={styles.bodyText}>
              No requests loaded. Press Refresh Requests to check Firebase.
            </Text>
          </View>
        ) : (
          serviceRequests.map((item) => (
            <View
              key={item.firestoreId}
              style={styles.profileInfoCard}
            >
              <Text style={styles.formTitle}>
                Installation Request
              </Text>

              <Text style={styles.bodyText}>
                Name: {item.name || 'Not provided'}
              </Text>

              <Text style={styles.bodyText}>
                Phone: {item.phone || 'Not provided'}
              </Text>

              <Text style={styles.bodyText}>
                Address: {item.address || 'Not provided'}
              </Text>

              <Text style={styles.bodyText}>
                Preferred Date: {item.preferredDate || 'Not provided'}
              </Text>

              <Text style={styles.bodyText}>
                Status: {item.status || 'Pending'}
              </Text>

              <Text style={styles.bodyText}>
                Request ID: {item.firestoreId}
              </Text>

              
              <Text style={[styles.formTitle, { marginTop: 12 }]}>
                Update Request Status
              </Text>

              {['Approved', 'Rejected', 'Completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.myOrdersButton}
                onPress={() =>
                  updateServiceRequestStatus(item.firestoreId, status)
                }
              >
                <Text style={styles.myOrdersButtonText}>
                  {item.status === status ? '✓ ' : ''}
                  {status}
                </Text>
                <Text style={styles.myOrdersArrow}>→</Text>
              </TouchableOpacity>
            ))}

            </View>
          ))
        )}
      </>
    )}

    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={() => setActiveTab('Profile')}
    >
      <Text style={styles.secondaryButtonText}>
        Back to Profile
      </Text>
    </TouchableOpacity>
  </ScrollView>
);


const renderMySupportRequests = () => {
  return (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>My Support Requests</Text>
      <Text style={styles.pageSubtitle}>
        Check the status of your submitted issues.
      </Text>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={loadMySupportRequests}
      >
        <Text style={styles.secondaryButtonText}>
          Refresh My Requests
        </Text>
      </TouchableOpacity>

      {mySupportRequests.length === 0 ? (
        <Text style={styles.bodyText}>
          No support requests found. Tap Refresh My Requests to check again.
        </Text>
      ) : (
        mySupportRequests.map((item) => (
          <View key={item.firestoreId} style={styles.profileInfoCard}>
            <Text style={styles.formTitle}>
              {item.message || 'Support request'}
            </Text>

            <Text style={styles.bodyText}>
              Submitted by: {item.name || 'Customer'}
            </Text>

            <Text style={styles.bodyText}>
              Phone: {item.phone || 'Not provided'}
            </Text>

            <Text style={styles.bodyText}>
              Status: {item.status || 'Pending'}
            </Text>

            <Text style={styles.bodyText}>
              Request ID: {item.firestoreId}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setActiveTab('Services')}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Services
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderAdminSupportRequests = () => {
  if (!isAdmin) {
    return (
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>Access Denied</Text>
        <Text style={styles.bodyText}>
          Only an authorized administrator can view support requests.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Admin Support Requests</Text>
      <Text style={styles.pageSubtitle}>
        View customer issues and manage their status.
      </Text>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={loadAdminSupportRequests}
      >
        <Text style={styles.secondaryButtonText}>Refresh Requests</Text>
      </TouchableOpacity>

      {supportRequests.length === 0 ? (
        <Text style={styles.bodyText}>
          No support requests found. Tap Refresh Requests to check again.
        </Text>
      ) : (
        supportRequests.map((item) => (
          <View key={item.firestoreId} style={styles.profileInfoCard}>
            <Text style={styles.formTitle}>
              {item.name || 'Customer'}
            </Text>

            <Text style={styles.bodyText}>
              Phone: {item.phone || 'Not provided'}
            </Text>

            <Text style={styles.bodyText}>
              Issue: {item.message || 'No description'}
            </Text>

            <Text style={styles.bodyText}>
              Status: {item.status || 'Pending'}
            </Text>

            <Text style={styles.bodyText}>
              Request ID: {item.firestoreId}
            </Text>

            {['Approved', 'Rejected', 'Completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.myOrdersButton}
                onPress={() =>
                  updateSupportRequestStatus(item.firestoreId, status)
                }
              >
                <Text style={styles.myOrdersButtonText}>
                  {item.status === status ? '✓ ' : ''}
                  {status}
                </Text>
                <Text style={styles.myOrdersArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setActiveTab('AdminOrders')}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Admin Dashboard
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

  
const renderAdminOrders = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Admin Dashboard</Text>
      <Text style={styles.pageSubtitle}>
        View orders and update their delivery status.
      </Text>
      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setActiveTab('AdminServiceRequests');
          loadAdminServiceRequests();
        }}
      >
        <Text style={styles.secondaryButtonText}>
          View Service Requests
        </Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setActiveTab('AdminSupportRequests');
          loadAdminSupportRequests();
        }}
      >
        <Text style={styles.secondaryButtonText}>
          View Support Requests
        </Text>
      </TouchableOpacity>


  
      {!isAdmin ? (
        <View style={styles.profileCard}>
          <Text style={styles.formTitle}>Access denied</Text>
          <Text style={styles.bodyText}>
            Only an authorized administrator can view this page.
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={loadAdminOrders}
          >
            <Text style={styles.secondaryButtonText}>
              Refresh Orders
            </Text>
          </TouchableOpacity>
  
          {orders.length === 0 ? (
            <View style={styles.profileCard}>
              <Text style={styles.bodyText}>
                No orders found. Press Refresh Orders to check again.
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View
                key={order.firestoreId || order.orderNumber}
                style={styles.profileInfoCard}
              >
                <Text style={styles.formTitle}>
                  Order #{order.orderNumber || order.firestoreId}
                </Text>
  
                <Text style={styles.bodyText}>
                  Customer: {order.customerName}
                </Text>
                <Text style={styles.bodyText}>
                  Order Type: {order.customerType || 'Retail'}
                </Text>
                <Text style={styles.bodyText}>
                  Email: {order.email || 'Not provided'}
                </Text>
                <Text style={styles.bodyText}>
                  Total: ₹{order.total}
                </Text>
                <Text style={styles.bodyText}>
                  Current status: {order.status || 'Processing'}
                </Text>
  
                <Text style={[styles.formTitle, { marginTop: 12 }]}>
                  Update Status
                </Text>
  
                {['Processing', 'Shipped', 'Delivered'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={styles.myOrdersButton}
                    onPress={() =>
                      updateOrderStatus(order.firestoreId, status)
                    }
                    disabled={!order.firestoreId}
                  >
                    <Text style={styles.myOrdersButtonText}>
                      {status === order.status ? '✓ ' : ''}
                      {status}
                    </Text>
                    <Text style={styles.myOrdersArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </>
      )}
  
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setActiveTab('Profile')}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
);


const loadAdminServiceRequests = async () => {
  if (!isAdmin) {
    Alert.alert(
      'Access denied',
      'Only an authorized administrator can view service requests.'
    );
    return;
  }

  try {
    const snapshot = await getDocs(
      collection(db, 'serviceRequests')
    );

    const requests = snapshot.docs.map((item) => ({
      firestoreId: item.id,
      ...item.data(),
    }));

    setServiceRequests(requests);
  } catch (error) {
    console.error('Error loading service requests:', error);

    const message = 'Could not load service requests.';

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Error', message);
    }
  }
};


const loadAdminSupportRequests = async () => {
  if (!isAdmin) {
    const message = 'Only an authorized administrator can view support requests.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Access denied', message);
    return;
  }

  try {
    const snapshot = await getDocs(
      collection(db, 'supportRequests')
    );

    const requests = snapshot.docs.map((item) => ({
      firestoreId: item.id,
      ...item.data(),
    }));

    setSupportRequests(requests);
  } catch (error) {
    console.error('Error loading support requests:', error);
    const message = 'Could not load support requests.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Error', message);
  }
};


const updateSupportRequestStatus = async (requestId, newStatus) => {
  if (!isAdmin) {
    const message = 'Only an administrator can update support requests.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Access denied', message);
    return;
  }

  try {
    await updateDoc(doc(db, 'supportRequests', requestId), {
      status: newStatus,
    });

    await loadAdminSupportRequests();

    const message = `Support request status updated to ${newStatus}.`;
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Success', message);
  } catch (error) {
    console.error('Error updating support request:', error);
    const message = 'Could not update the support request. Check Firebase permissions.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Error', message);
  }
};


const loadMySupportRequests = async () => {
  if (!auth.currentUser) {
    const message = 'Please sign in to view your support requests.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Sign in required', message);
    return;
  }

  try {
    const requestsQuery = query(
      collection(db, 'supportRequests'),
      where('userId', '==', auth.currentUser.uid)
    );

    const snapshot = await getDocs(requestsQuery);

    const requests = snapshot.docs.map((item) => ({
      firestoreId: item.id,
      ...item.data(),
    }));

    setMySupportRequests(requests);
  } catch (error) {
    console.error('Error loading my support requests:', error);
    const message = 'Could not load your support requests.';
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Error', message);
  }
};


const updateServiceRequestStatus = async (requestId, newStatus) => {
  if (!isAdmin) {
    const message = 'Only an administrator can update service requests.';

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Access denied', message);
    }
    return;
  }

  try {
    await updateDoc(doc(db, 'serviceRequests', requestId), {
      status: newStatus,
    });

    await loadAdminServiceRequests();

    const message = `Request status updated to ${newStatus}.`;

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Success', message);
    }
  } catch (error) {
    console.error('Error updating service request:', error);

    const message =
      'Could not update the request. Check Firestore permissions.';

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Error', message);
    }
  }
};

  
const loadDealerApplications = async () => {
    if (!auth.currentUser || !isAdmin) {
      showAppAlert('Access denied', 'Admin access is required.');
      return;
    }
  
    try {
      const snapshot = await getDocs(
        collection(db, 'dealerApplications')
      );
  
      const applications = snapshot.docs.map((applicationDoc) => ({
        ...applicationDoc.data(),
        applicationId: applicationDoc.id,
      }));
  
      setDealerApplications(applications);
    } catch (error) {
      console.error('Load dealer applications error:', error);
      showAppAlert(
        'Error',
        'Could not load dealer applications.'
      );
    }
  };


  
const updateDealerApplication = async (userId, status) => {
    if (!auth.currentUser || !isAdmin) {
      showAppAlert('Access denied', 'Admin access is required.');
      return;
    }
  
    if (!['approved', 'rejected'].includes(status)) {
      return;
    }
  
    try {
      await updateDoc(
        doc(db, 'dealerApplications', userId),
        { status }
      );
  
      setDealerApplications((current) =>
        current.map((application) =>
          application.applicationId === userId
            ? { ...application, status }
            : application
        )
      );
  
      showAppAlert(
        'Success',
        `Dealer application ${status}.`
      );
    } catch (error) {
      console.error('Dealer approval error:', error);
      showAppAlert(
        'Update failed',
        'Could not update the dealer application.'
      );
    }
  };
  
  
  

  // LOGIN SCREEN
  
  const renderLogin = () => (
    <ScrollView contentContainerStyle={styles.authPage}>
      <View style={styles.authHero}>
        <Text style={styles.authEmoji}>💧</Text>
        <Text style={styles.authBrand}>Califnco</Text>
        <Text style={styles.authSubtitle}>
          Welcome back to pure living.
        </Text>
      </View>
  
      <View style={styles.authCard}>
        <Text style={styles.pageTitle}>Login</Text>
        <Text style={styles.pageSubtitle}>
          Sign in to your Califnco account.
        </Text>
  
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your email"
          placeholderTextColor="#7A8C98"
          value={loginEmail}
          onChangeText={setLoginEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your password"
          placeholderTextColor="#7A8C98"
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
          autoCapitalize="none"
        />
  
        <TouchableOpacity
          style={styles.primaryButtonLarge}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
  
        <View style={styles.authSwitchRow}>
          <Text style={styles.authSwitchText}>
            Don't have an account? 
          </Text>
  
          <TouchableOpacity onPress={() => setActiveTab('Signup')}>
            <Text style={styles.authLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  

  // SIGNUP SCREEN
  const renderSignup = () => (
    <ScrollView contentContainerStyle={styles.authPage}>
      <View style={styles.authHero}>
        <Text style={styles.authEmoji}>💧</Text>
        <Text style={styles.authBrand}>Join Califnco</Text>
        <Text style={styles.authSubtitle}>Create an account to get started.</Text>
      </View>

      <View style={styles.authCard}>
        <Text style={styles.pageTitle}>Create Account</Text>
        <Text style={styles.pageSubtitle}>Fill in your details below.</Text>

        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your full name"
          placeholderTextColor="#7A8C98"
          value={signupName}
          onChangeText={setSignupName}
          autoCapitalize="words"
        />

        <Text style={styles.inputLabel}>Mobile Number</Text>
        <TextInput
          style={styles.formInput}
          placeholder="10-digit mobile number"
          placeholderTextColor="#7A8C98"
          value={signupPhone}
          onChangeText={(value) => setSignupPhone(value.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your email"
          placeholderTextColor="#7A8C98"
          value={signupEmail}
          onChangeText={setSignupEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="At least 6 characters"
          placeholderTextColor="#7A8C98"
          value={signupPassword}
          onChangeText={setSignupPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Re-enter your password"
          placeholderTextColor="#7A8C98"
          value={signupConfirmPassword}
          onChangeText={setSignupConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.primaryButtonLarge} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.authSwitchRow}>
          <Text style={styles.authSwitchText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => setActiveTab('Login')}>
            <Text style={styles.authLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>My Profile</Text>
      <Text style={styles.pageSubtitle}>Manage your Califnco account.</Text>

      {currentUser ? (
        <>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileEmoji}>👤</Text>
            </View>

            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.bodyText}>{currentUser.email}</Text>
            <Text style={styles.bodyText}>{currentUser.phone}</Text>

            <View style={styles.signedInBadge}>
              <Text style={styles.signedInText}>✓ Signed in</Text>
            </View>
          </View>

          <View style={styles.profileInfoCard}>
            <Text style={styles.formTitle}>Account Information</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Name</Text>
              <Text style={styles.summaryValue}>{currentUser.name}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Email</Text>
              <Text style={styles.summaryValue}>{currentUser.email}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phone</Text>
              <Text style={styles.summaryValue}>{currentUser.phone}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.myOrdersButton}
            onPress={() => setActiveTab('MyOrders')}
          >
            <Text style={styles.myOrdersButtonText}>📦  My Orders</Text>
            <Text style={styles.myOrdersArrow}>→</Text>
          </TouchableOpacity>
        
          
          <TouchableOpacity
            style={styles.myOrdersButton}
            onPress={() => setActiveTab('DealerApplication')}
          >
            <Text style={styles.myOrdersButtonText}>
                🏪 Apply for Dealer Account
            </Text>
            <Text style={styles.myOrdersArrow}>→</Text>
          </TouchableOpacity>

          
          {isAdmin && (
            <TouchableOpacity
                style={styles.myOrdersButton}
                onPress={() => {
                    setActiveTab('AdminOrders');
                    loadAdminOrders();
                }}
            >
                <Text style={styles.myOrdersButtonText}>
                    🛠️  Admin Dashboard
                </Text>
                <Text style={styles.myOrdersArrow}>→</Text>
            </TouchableOpacity>
          )}


          {isAdmin && (
            <TouchableOpacity
                style={styles.myOrdersButton}
                onPress={() => {
                    setActiveTab('AdminDealers');
                    loadDealerApplications();
          }}
            >
              <Text style={styles.myOrdersButtonText}>
                🏪 Dealer Applications
              </Text>
              <Text style={styles.myOrdersArrow}>→</Text>
            </TouchableOpacity>
          )}


          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👤</Text>
          <Text style={styles.formTitle}>Welcome to Califnco</Text>
          <Text style={styles.bodyText}>
            Log in or create an account to see your customer profile.
          </Text>

          <TouchableOpacity
            style={styles.primaryButtonLarge}
            onPress={() => setActiveTab('Login')}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setActiveTab('Signup')}
          >
            <Text style={styles.secondaryButtonText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderDealerApplication = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Dealer Application</Text>
  
      <Text style={styles.pageSubtitle}>
        Apply for a Califnco dealer account to access wholesale pricing
        and bulk orders.
      </Text>
  
      <View style={styles.profileInfoCard}>
        <Text style={styles.formTitle}>Your Account</Text>
  
        <Text style={styles.bodyText}>
          Name: {currentUser?.name || ''}
        </Text>
  
        <Text style={styles.bodyText}>
          Email: {currentUser?.email || ''}
        </Text>
  
        <Text style={styles.bodyText}>
          Phone: {currentUser?.phone || ''}
        </Text>
  
        <Text style={styles.bodyText}>
          Dealer access requires admin approval.
        </Text>
  
        <TouchableOpacity
          style={styles.primaryButtonLarge}
          onPress={submitDealerApplication}
        >
          <Text style={styles.primaryButtonText}>
            Apply for Dealer Account
          </Text>
        </TouchableOpacity>
      </View>
  
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setActiveTab('Profile')}
      >
        <Text style={styles.secondaryButtonText}>Back to Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderServiceCard = () => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceEmoji}>🔧</Text>

      <View style={styles.serviceTextContainer}>
        <Text style={styles.serviceTitle}>Need purifier service?</Text>
        <Text style={styles.serviceDescription}>
          Explore support options for your purifier.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.serviceButton}
        onPress={() => setActiveTab('Services')}
      >
        <Text style={styles.serviceButtonText}>Explore</Text>
      </TouchableOpacity>
    </View>
  );

  

  const renderServices = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Services & Support</Text>
      <Text style={styles.pageSubtitle}>
        Find support for your purifier.
      </Text>
  
      {[
        ['🔧', 'Installation Support', 'Installation'],
        ['🛠️', 'Maintenance', 'Maintenance'],
        ['💬', 'Customer Support', 'CustomerSupport'],
      ].map(([emoji, title, target]) => (
        <TouchableOpacity
          key={title}
          style={styles.serviceOption}
          activeOpacity={0.7}
          onPress={() => setActiveTab(target)}
        >
          <Text style={styles.serviceOptionEmoji}>{emoji}</Text>
          <View style={styles.serviceTextContainer}>
            <Text style={styles.serviceTitle}>{title}</Text>
            <Text style={styles.serviceDescription}>
              {title === 'Installation Support'
                ? 'Explore installation assistance.'
                : title === 'Maintenance'
                  ? 'Learn about regular purifier maintenance.'
                  : 'Contact your seller for product assistance.'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setActiveTab('MySupportRequests');
          loadMySupportRequests();
        }}
      >
        <Text style={styles.secondaryButtonText}>
          My Support Requests
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  

  console.log('Dealer status:', dealerStatus, 'Is admin:', isAdmin);
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return renderHome();
      case 'Categories':
        return renderCategoriesPage();
      case 'ProductDetails':
        return renderProductDetails();
      case 'Cart':
        return renderCart();
      case 'Checkout':
        return renderCheckout();
      case 'OrderSuccess':
        return renderOrderSuccess();
      case 'MyOrders':
        return renderMyOrders();
      case 'AdminOrders':
        return renderAdminOrders();
      case 'AdminServiceRequests':
        return renderAdminServiceRequests();
      case 'AdminSupportRequests':
        return renderAdminSupportRequests();
      case 'MySupportRequests':
        return renderMySupportRequests();
      case 'AdminDealers':
        return renderAdminDealers();
      case 'Login':
        return renderLogin();
      case 'Signup':
        return renderSignup();
      case 'Profile':
        return renderProfile();
      case 'DealerApplication':
        return renderDealerApplication();
      case 'Services':
        return renderServices();
        
      case 'Installation':
        return (
          <ScrollView contentContainerStyle={styles.pageContent}>
            <Text style={styles.pageTitle}>Installation Support</Text>
            <Text style={styles.pageSubtitle}>
              Request installation for your water purifier.
            </Text>
        
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={serviceName}
              onChangeText={setServiceName}
            />
        
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={servicePhone}
              onChangeText={setServicePhone}
              keyboardType="phone-pad"
            />
        
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholder="Full installation address"
              value={serviceAddress}
              onChangeText={setServiceAddress}
              multiline
            />
        
            <TextInput
              style={styles.input}
              placeholder="Preferred date (DD/MM/YYYY)"
              value={serviceDate}
              onChangeText={setServiceDate}
            />
        
            
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={async () => {
                if (
                  !serviceName.trim() ||
                  !servicePhone.trim() ||
                  !serviceAddress.trim() ||
                  !serviceDate.trim()
                ) {
                  const message = 'Please fill in all fields.';
                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Missing details', message);
                  }
                  return;
                }

                if (!/^[0-9]{10}$/.test(servicePhone.trim())) {
                  const message = 'Please enter a valid 10-digit phone number.';
                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Invalid phone number', message);
                  }
                  return;
                }

                
                try {
                  await addDoc(collection(db, 'serviceRequests'), {
                    userId: auth.currentUser.uid,
                    name: serviceName.trim(),
                    phone: servicePhone.trim(),
                    address: serviceAddress.trim(),
                    preferredDate: serviceDate.trim(),
                    serviceType: 'Installation',
                    status: 'Pending',
                    createdAt: new Date().toISOString(),
                  });

                  const message = 'Installation request saved successfully!';

                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                   Alert.alert('Success', message);
                  }

                  setServiceName('');
                  setServicePhone('');
                  setServiceAddress('');
                  setServiceDate('');
                  setActiveTab('Services');
                }
                catch (error) {
                  console.error('Service request error:', error);

                  const message =
                    'Could not save your request. Please check your internet connection and Firebase permissions.';

                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Error', message);
                  }
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Submit Request</Text>
            </TouchableOpacity>

          </ScrollView>
        );
        
      
      case 'Maintenance':
        return (
          <ScrollView contentContainerStyle={styles.pageContent}>
            <Text style={styles.pageTitle}>Purifier Maintenance</Text>
  
            <Text style={styles.pageSubtitle}>
              Simple care tips to keep your water purifier working properly.
            </Text>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>
                1. Clean the exterior
              </Text>
              <Text style={styles.bodyText}>
                Wipe the outside with a soft, damp cloth. Avoid pouring water
                directly onto the purifier or its electrical parts.
              </Text>
            </View>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>
                2. Replace filters on time
              </Text>
              <Text style={styles.bodyText}>
                Follow the manufacturer's recommended filter replacement
                schedule. Timing depends on your purifier model and water quality.
              </Text>
            </View>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>
                3. Check for leaks
              </Text>
              <Text style={styles.bodyText}>
                Regularly check the pipes and connections for leakage. If you
                notice a leak, turn off the water supply and contact a technician.
              </Text>
            </View>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>
                4. Watch for warning signs
              </Text>
              <Text style={styles.bodyText}>
                Reduced water flow, unusual sounds, or changes in taste may
                indicate that your purifier needs inspection.
              </Text>
            </View>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>
                5. Need professional maintenance?
              </Text>
              <Text style={styles.bodyText}>
                Submit an installation request through Installation Support
                or contact your seller for servicing assistance.
              </Text>
  
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setActiveTab('Installation')}
              >
                <Text style={styles.primaryButtonText}>
                  Request Service
                </Text>
              </TouchableOpacity>
            </View>
  
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setActiveTab('Services')}
            >
              <Text style={styles.secondaryButtonText}>
                Back to Services
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );
  
        
      
      case 'CustomerSupport':
        return (
          <ScrollView contentContainerStyle={styles.pageContent}>
            <Text style={styles.pageTitle}>Customer Support</Text>

            <Text style={styles.pageSubtitle}>
              Tell us about your purifier issue, and our team can review your request.
            </Text>
  
            <View style={styles.profileInfoCard}>
              <Text style={styles.formTitle}>Need help?</Text>
              <Text style={styles.bodyText}>
                You can report issues with water flow, filter replacement,
                leakage, installation, or other product concerns.
              </Text>
            </View>
  
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={supportName}
              onChangeText={setSupportName}
            />
  
            <TextInput
              style={styles.input}
              placeholder="10-digit phone number"
              value={supportPhone}
              onChangeText={setSupportPhone}
              keyboardType="phone-pad"
            />
  
            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Describe your issue"
              value={supportMessage}
              onChangeText={setSupportMessage}
              multiline
              textAlignVertical="top"
            />
  
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={async () => {
                if (
                  !supportName.trim() ||
                  !supportPhone.trim() ||
                  !supportMessage.trim()
                ) {
                  const message = 'Please fill in all fields.';
  
                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Missing details', message);
                  }
                  return;
                }
  
                if (!/^[0-9]{10}$/.test(supportPhone.trim())) {
                  const message = 'Please enter a valid 10-digit phone number.';
  
                  if (Platform.OS === 'web') {
                      window.alert(message);
                  } else {
                    Alert.alert('Invalid phone number', message);
                  }
                  return;
                }
  
                if (!auth.currentUser) {
                  const message = 'Please sign in before submitting a support request.';
  
                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Sign in required', message);
                  }
                  return;
                }
  
                try {
                  await addDoc(collection(db, 'supportRequests'), {
                    userId: auth.currentUser.uid,
                    name: supportName.trim(),
                    phone: supportPhone.trim(),
                    message: supportMessage.trim(),
                    status: 'Pending',
                    createdAt: new Date().toISOString(),
                  });
  
                  const message = 'Your support request has been submitted.';
  
                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Success', message);
                  }
  
                  setSupportName('');
                  setSupportPhone('');
                  setSupportMessage('');
                  setActiveTab('Services');
                } catch (error) {
                  console.error('Support request error:', error);
  
                  const message =
                    'Could not submit your request. Please check your Firebase permissions.';

                  if (Platform.OS === 'web') {
                    window.alert(message);
                  } else {
                    Alert.alert('Error', message);
                  }
                }
              }}
            >
              <Text style={styles.primaryButtonText}>
                Submit Support Request
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setActiveTab('Services')}
            >
              <Text style={styles.secondaryButtonText}>
                Back to Services
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );
  
        
      default:
        return renderHome();
    }
  };


  
  const renderAdminDealers = () => (
    <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageTitle}>Dealer Applications</Text>
      <Text style={styles.pageSubtitle}>
        Review and approve dealer account requests.
      </Text>
  
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={loadDealerApplications}
      >
        <Text style={styles.secondaryButtonText}>
          Refresh Applications
        </Text>
      </TouchableOpacity>
  
      {dealerApplications.length === 0 ? (
        <View style={styles.profileInfoCard}>
          <Text style={styles.bodyText}>
            No dealer applications found.
          </Text>
        </View>
      ) : (
        dealerApplications.map((application) => (
          <View
            key={application.applicationId}
            style={styles.profileInfoCard}
          >
            <Text style={styles.formTitle}>
              {application.name || 'Dealer'}
            </Text>
            <Text style={styles.bodyText}>
              Email: {application.email}
            </Text>
            <Text style={styles.bodyText}>
              Phone: {application.phone}
            </Text>
            <Text style={styles.bodyText}>
              Status: {application.status}
            </Text>
  
            {application.status === 'pending' && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[styles.primaryButtonLarge, { flex: 1 }]}
                  onPress={() =>
                    updateDealerApplication(
                      application.applicationId,
                      'approved'
                    )
                  }
                >
                  <Text style={styles.primaryButtonText}>
                    Approve
                  </Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={() =>
                    updateDealerApplication(
                      application.applicationId,
                      'rejected'
                    )
                  }
                >
                  <Text style={styles.secondaryButtonText}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
  
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setActiveTab('Profile')}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  


  const hideBottomNav = [
    'Checkout',
    'OrderSuccess',
    'ProductDetails',
    'Login',
    'Signup',
    'MyOrders',
  ].includes(activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderHeader()}

      <View style={styles.content}>{renderContent()}</View>

      {!hideBottomNav && (
        <View style={styles.bottomNav}>
          {[
            ['Home', '⌂'],
            ['Categories', '▦'],
            ['Cart', '🛒'],
            ['Services', '⚙'],
            ['Profile', '☺'],
          ].map(([tab, icon]) => (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navIcon, activeTab === tab && styles.navActive]}>
                {icon}{tab === 'Cart' && cartCount > 0 ? ` ${cartCount}` : ''}
              </Text>

              <Text style={[styles.navLabel, activeTab === tab && styles.navActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FA',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    minHeight: 72,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF2',
  },
  logo: { fontSize: 25, fontWeight: '900', color: '#087F8C' },
  logoCaption: { fontSize: 9, color: '#627D89', letterSpacing: 1.3, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { backgroundColor: '#F0F5F7', padding: 10, borderRadius: 12 },
  headerIconText: { fontSize: 17 },
  headerCart: {
    backgroundColor: '#E6F5F6',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
  },
  headerCartText: { fontSize: 15, fontWeight: '800', color: '#087F8C' },
  content: { flex: 1 },

  hero: {
    backgroundColor: '#DDF4F5',
    margin: 16,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#087F8C',
    marginBottom: 12,
  },
  heroTitle: { fontSize: 31, fontWeight: '900', color: '#103B4A', lineHeight: 37 },
  heroDescription: {
    fontSize: 14,
    color: '#456774',
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 260,
  },
  heroButton: {
    backgroundColor: '#087F8C',
    paddingVertical: 13,
    paddingHorizontal: 17,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  heroButtonText: { color: '#FFFFFF', fontWeight: '800' },
  heroEmoji: { position: 'absolute', fontSize: 100, right: 0, bottom: 8, opacity: 0.35 },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  benefitItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  benefitEmoji: { fontSize: 23, marginBottom: 6 },
  benefitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34515E',
    textAlign: 'center',
  },
  section: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#163B4A',
    marginBottom: 12,
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E0E9ED',
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 14,
    color: '#163B4A',
    marginBottom: 12,
  },
  categoryRow: { flexDirection: 'row', gap: 9, paddingVertical: 5, paddingBottom: 15 },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#D7E4E9',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 17,
  },
  categoryButtonActive: { backgroundColor: '#087F8C', borderColor: '#087F8C' },
  categoryText: { fontSize: 12, color: '#47616D', fontWeight: '700' },
  categoryTextActive: { color: '#FFFFFF' },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  mutedText: { color: '#758993', fontSize: 12, lineHeight: 18 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    padding: 12,
    width: '48.5%',
    marginBottom: 13,
  },
  productImage: {
    backgroundColor: '#E8F6F7',
    height: 112,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productEmoji: { fontSize: 53 },
  productType: { fontSize: 10, color: '#087F8C', fontWeight: '800', marginBottom: 5 },
  productName: { fontSize: 15, fontWeight: '900', color: '#163B4A', marginBottom: 5 },
  productPrice: { fontSize: 17, fontWeight: '900', color: '#087F8C', marginBottom: 11 },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#087F8C',
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsButtonText: { color: '#087F8C', fontWeight: '800', fontSize: 12 },
  primaryButton: {
    backgroundColor: '#087F8C',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  primaryButtonLarge: {
    backgroundColor: '#087F8C',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceEmoji: { fontSize: 28, marginRight: 12 },
  serviceTextContainer: { flex: 1 },
  serviceTitle: { fontSize: 14, fontWeight: '900', color: '#163B4A', marginBottom: 4 },
  serviceDescription: { fontSize: 12, color: '#758993', lineHeight: 18 },
  serviceButton: {
    backgroundColor: '#E6F5F6',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    marginLeft: 7,
  },
  serviceButtonText: { color: '#087F8C', fontSize: 11, fontWeight: '800' },

  pageContent: { padding: 18, paddingBottom: 30 },
  pageTitle: { fontSize: 27, fontWeight: '900', color: '#163B4A', marginBottom: 7 },
  pageSubtitle: { color: '#758993', fontSize: 13, lineHeight: 20, marginBottom: 17 },
  emptyText: { color: '#758993', textAlign: 'center', paddingVertical: 25 },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 15,
  },
  emptyEmoji: { fontSize: 45, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#163B4A', marginBottom: 8 },

  detailsPage: {
    padding: 18,
    paddingBottom: 35,
    maxWidth: 850,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: { alignSelf: 'flex-start', paddingVertical: 9, paddingRight: 12, marginBottom: 12 },
  backButtonText: { color: '#087F8C', fontSize: 13, fontWeight: '800' },
  detailsHero: {
    backgroundColor: '#E3F5F6',
    minHeight: 235,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  detailsProductImage: {
    width: '80%',
    height: 180,
    alignSelf: 'center',
  },
  detailsTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 8,
  },
  detailsTagText: { color: '#087F8C', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  detailsType: { color: '#087F8C', fontSize: 12, fontWeight: '900', marginBottom: 5 },
  detailsName: { color: '#163B4A', fontSize: 29, fontWeight: '900', marginBottom: 8 },
  detailsPrice: { color: '#087F8C', fontSize: 26, fontWeight: '900' },
  taxNote: { color: '#758993', fontSize: 11, marginTop: 5, marginBottom: 16 },
  bodyText: { color: '#4D6570', fontSize: 14, lineHeight: 22, marginBottom: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 11 },
  featureCheck: { color: '#087F8C', fontWeight: '900', fontSize: 17, marginRight: 10 },
  featureText: { color: '#34515E', fontSize: 13, lineHeight: 20, flex: 1 },
  specCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 14,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#E7EEF1',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF2',
    gap: 15,
  },
  specLabel: { color: '#758993', fontSize: 12, flex: 1 },
  specValue: { color: '#163B4A', fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'right' },
  disclaimer: { fontSize: 11, color: '#758993', lineHeight: 17, marginTop: 12, marginBottom: 5 },
  buyNowButton: {
    backgroundColor: '#163B4A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buyNowButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    padding: 12,
    marginBottom: 12,
  },
  cartEmojiBox: {
    width: 90,
    height: 100,
    borderRadius: 13,
    backgroundColor: '#E8F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  cartEmoji: { fontSize: 43 },
  cartInfo: { flex: 1, justifyContent: 'center' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 10, flexWrap: 'wrap' },
  quantityButton: {
    width: 29,
    height: 29,
    backgroundColor: '#E6F5F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: { fontSize: 19, fontWeight: '900', color: '#087F8C' },
  quantityText: { fontSize: 13, fontWeight: '900', color: '#163B4A' },
  removeText: { fontSize: 11, fontWeight: '800', color: '#C84C4C' },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7EEF1',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  summaryTitle: { color: '#163B4A', fontSize: 17, fontWeight: '900', marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 11,
    gap: 12,
  },
  summaryLabel: { color: '#627D89', fontSize: 12, flex: 1 },
  summaryValue: { color: '#163B4A', fontSize: 12, fontWeight: '700' },
  summaryDivider: { borderBottomWidth: 1, borderBottomColor: '#E4ECEF', marginVertical: 6 },
  totalLabel: { color: '#163B4A', fontSize: 15, fontWeight: '900' },
  totalValue: { color: '#087F8C', fontSize: 17, fontWeight: '900' },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    padding: 16,
  },
  formTitle: { fontSize: 17, fontWeight: '900', color: '#163B4A', marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: '800', color: '#34515E', marginBottom: 7, marginTop: 8 },
  formInput: {
    borderWidth: 1,
    borderColor: '#DCE7EB',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#163B4A',
    backgroundColor: '#FFFFFF',
  },
  addressInput: { height: 95, paddingTop: 12 },

  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7EEF1',
  },
  successEmoji: { fontSize: 60, marginTop: 5, marginBottom: 12 },
  successTitle: { color: '#163B4A', fontSize: 26, fontWeight: '900', marginBottom: 9 },
  successDescription: {
    textAlign: 'center',
    color: '#627D89',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 17,
  },
  orderNumberBox: {
    backgroundColor: '#E8F6F7',
    borderRadius: 13,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderNumber: { color: '#087F8C', fontSize: 20, fontWeight: '900', marginVertical: 5 },
  orderInfo: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E8EEF2',
    paddingTop: 15,
    marginTop: 4,
  },

  // NEW MY ORDERS STYLES
  myOrdersButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myOrdersButtonText: { color: '#163B4A', fontSize: 14, fontWeight: '900' },
  myOrdersArrow: { color: '#087F8C', fontSize: 22, fontWeight: '900' },
  myOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    padding: 16,
    marginBottom: 16,
  },
  myOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderStatusBadge: {
    backgroundColor: '#FFF2D8',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  orderStatusText: { color: '#986A12', fontSize: 11, fontWeight: '900' },
  myOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  myOrderEmoji: {
    fontSize: 29,
    backgroundColor: '#E8F6F7',
    borderRadius: 10,
    padding: 8,
  },
  orderDeliveryInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E8EEF2',
    paddingTop: 14,
    marginTop: 6,
  },

  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7EEF1',
  },
  serviceOptionEmoji: { fontSize: 30, marginRight: 14 },

  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 23,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7EEF1',
  },
  profileEmoji: { fontSize: 54, marginBottom: 12 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7EEF1',
    paddingTop: 9,
    paddingBottom: 7,
    minHeight: 62,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 2 },
  navIcon: { fontSize: 18, color: '#82949D', fontWeight: '800' },
  navLabel: { fontSize: 10, color: '#82949D', fontWeight: '700', marginTop: 3 },
  navActive: { color: '#087F8C' },

  // AUTHENTICATION STYLES
  authPage: {
    padding: 18,
    paddingBottom: 35,
    maxWidth: 650,
    width: '100%',
    alignSelf: 'center',
  },
  authHero: {
    backgroundColor: '#DDF4F5',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
  },
  authEmoji: { fontSize: 48, marginBottom: 7 },
  authBrand: { fontSize: 27, fontWeight: '900', color: '#087F8C' },
  authSubtitle: { fontSize: 13, color: '#456774', marginTop: 5, textAlign: 'center' },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7EEF1',
  },
  authSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  authSwitchText: { color: '#627D89', fontSize: 12 },
  authLink: { color: '#087F8C', fontWeight: '900', fontSize: 12 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#087F8C',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  secondaryButtonText: { color: '#087F8C', fontWeight: '800', fontSize: 13 },
  profileAvatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#E6F5F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: { fontSize: 21, fontWeight: '900', color: '#163B4A', marginBottom: 7 },
  signedInBadge: {
    backgroundColor: '#E6F5F6',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  signedInText: { color: '#087F8C', fontWeight: '800', fontSize: 12 },
  profileInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7EEF1',
    marginBottom: 10,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#C84C4C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: { color: '#C84C4C', fontWeight: '900', fontSize: 14 },
});
