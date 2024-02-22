import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        width: 288, // 4 inches converted to points (1 inch = 72 points)
        height: 432, // 6 inches converted to points
        padding: 20,
        textAlign: 'center',
    },
    header: {
        fontSize: 12,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginBottom: 10,
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 2,
    },
    orderLabel: {
        fontSize: 10,
    },
    horizontalLine: {
        borderBottom: 1,
        borderColor: 'black',
        marginBottom: 20,
    },
    customerDetails: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 15
    },
    staticNotes: {
        fontSize: 9,
        marginTop: '35%',
        marginLeft: 10,
        textAlign: 'left',
    },
    thankYou: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

const OrderLabelInvoicePDF = ({ orderDetails, customerDetails, addressDetails }) => {
    return (
        <Document>
            <Page size={[288, 432]} style={styles.page}>
                {/* Name & Delivery Address */}
                <Text style={styles.header}>Name & Delivery Address</Text>

                {/* Order No and Order Date */}
                <View style={styles.orderInfo}>
                    <View>
                        <Text style={styles.orderLabel}>Order No: {orderDetails?.orderId}</Text>
                    </View>
                    <View>
                        <Text style={styles.orderLabel}>Order Date: {new Date(orderDetails?.createdAt).toLocaleDateString('en-IN')}</Text>
                    </View>
                </View>

                {/* Horizontal Line */}
                <View style={styles.horizontalLine}></View>

                {/* Customer Details */}
                <View>
                    <Text style={styles.customerDetails}>{addressDetails?.Name}</Text>
                    <Text style={styles.customerDetails}>{addressDetails?.Full_Address}</Text>
                    <Text style={styles.customerDetails}>{addressDetails?.Phone_Number}</Text>
                    <Text style={styles.customerDetails}>{addressDetails?.addressFrom}</Text>
                    <Text style={styles.customerDetails}>{orderDetails?.Company}</Text>
                </View>

                {/* Static Notes */}
                <Text style={styles.staticNotes}>
                    Please make a package opening video before opening your package. If any issue, send us the package opening
                    video within 24 hours of receiving the package. No claims will be entertained without an opening video.
                </Text>

                {/* Thank You */}
                <Text style={styles.thankYou}>Thank You</Text>
            </Page>
        </Document>
    );
};

export default OrderLabelInvoicePDF;
