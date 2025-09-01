import firestore from '@react-native-firebase/firestore';

export const testFirestore = async () => {
  try {
    console.log('Testing Firestore initialization...');
    
    // Test basic Firestore functionality
    const testCollection = firestore().collection('test');
    console.log('Test collection reference:', testCollection);
    
    // Test document reference
    const testDoc = testCollection.doc('test-doc');
    console.log('Test document reference:', testDoc);
    
    // Test setting a document
    const testData = { test: 'data', timestamp: new Date().toISOString() };
    await testDoc.set(testData);
    console.log('Test document set successfully');
    
    // Test getting a document
    const docSnapshot = await testDoc.get();
    console.log('Test document retrieved:', docSnapshot.data());
    
    // Clean up
    await testDoc.delete();
    console.log('Test document deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Firestore test failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
};

