import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: 1
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 20,
    },
    tableRow: {
        flexDirection: 'row',
    },
    OrderIdHeader: {
        fontSize: 10,
        width: 200,
    },
    tableHeader: {
        fontSize: 12,
        padding: 8,
        width: 100,
        backgroundColor: '#f2f2f2', // Light gray background for header
        border: 1,
        borderColor: 'black',
        textAlign: 'center',
    },
    tableImageHeader: {
        fontSize: 12,
        padding: 8,
        width: 100,
        backgroundColor: '#f2f2f2', // Light gray background for header
        border: 1,
        borderColor: 'black',
        textAlign: 'center',
    },
    tableCol: {
        fontSize: 10,
        width: 100,
        padding: 8,
        border: 1,
        borderColor: 'black',
        textAlign: 'center',
    },
    imageCol: {
        width: 100,
        padding: 8,
        border: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '80%',
        height: 'auto',
    },
});

const OrderInvoicePDF = ({ orderDetails, productDetails }) => {
    productDetails = productDetails ? productDetails : [];
    orderDetails = orderDetails ? orderDetails : [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Title header */}
                <Text style={styles.header}>Packing Slip</Text>

                <Text style={styles.OrderIdHeader}>Order No:- {orderDetails?.orderId}</Text>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table header */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>No.</Text>
                        <Text style={styles.tableImageHeader}>Product</Text>
                        <Text style={styles.tableHeader}>Item</Text>
                        <Text style={styles.tableHeader}>Color</Text>
                        <Text style={styles.tableHeader}>Size</Text>
                        <Text style={styles.tableHeader}>Qty</Text>
                    </View>

                    {/* Table rows */}
                    {productDetails.map((product, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCol}>{index + 1}</Text>
                            <View style={styles.imageCol}>
                                {product.variation_Image !== '' && (
                                    <Image style={styles.image} src={product.variation_Image} />
                                )}
                            </View>
                            <Text style={styles.tableCol}>{product?.product?.Product_Name?.slice(0, 40) + '...'}</Text>
                            <Text style={styles.tableCol}>{product?.variation?.Variation_Name}</Text>
                            <Text style={styles.tableCol}>{product?.sizeName}</Text>
                            <Text style={styles.tableCol}>{product.quantity}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default OrderInvoicePDF;
