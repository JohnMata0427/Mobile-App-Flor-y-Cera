export const InvoiceAccordion = memo(() => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View>
          <Text style={globalStyles.labelText}>
            Pedido: {item._id.slice(item._id.length - 8, item._id.length)}
          </Text>
          <Text style={globalStyles.bodyText}>Fecha: {toLocaleDate(item.fecha_venta)}</Text>
        </View>
        <Text style={globalStyles.labelText}>$ {item.total.toFixed(2)}</Text>
      </View>

      <FlatList
        data={item.productos}
        keyExtractor={({ _id }) => _id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({
          item: { _id, nombre, descripcion, imagen, cantidad, precio, tipo, ingredientes },
        }) => (
          <View key={_id} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Image source={{ uri: imagen }} style={styles.productImage} contentFit="cover" />
              <View>
                <Text style={globalStyles.labelText}>
                  {nombre ??
                    (tipo === 'personalizado' ? 'Producto Personalizado' : 'Recomendación de IA')}
                </Text>
                <Text style={styles.productDescription}>
                  {descripcion ??
                    `Ingredientes: ${ingredientes?.map(ing => ing.nombre).join(', ')}`}
                </Text>
              </View>
            </View>
            <View style={styles.productDetails}>
              <Text style={globalStyles.labelText}>$ {precio.toFixed(2)}</Text>
              <Text style={globalStyles.bodyText}>x {cantidad}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
});
