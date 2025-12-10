import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useColorScheme,
  Text
} from 'react-native';
import axios from 'axios';
import Color from '../constraints/Color';
import CustomButton from '../components/CustomButton';

const HomeScreen = ({ navigation }) => {

  const colorScheme = useColorScheme();
  const ColorsBasedOnThem = useMemo(() => colorScheme === 'dark' ? Color.Dark : Color.Light, [colorScheme]);

  const [images, setImages] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aspectRatios, setAspectRatios] = useState({});

  const [URLs, setURLs] = useState<string>("")

  const fetchImages = useCallback(async (newOffset = 0) => {
    if (loading) return;

    setLoading(true);

    try {
      const URL = `http://dev3.xicomtechnologies.com/xttest/getdata.php?user_id=108&offset=${newOffset}&type=populnar`
      setURLs(URL);
      const response = await axios.get(URL);

      if (response.data && response.data.images.length > 0) {
        setImages(newOffset === 0 ? response.data.images : [...images, ...response.data.images]);
        setOffset(newOffset + 1);
      }
    } catch {
      Alert.alert("Error", "Failed to fetch images");
    }

    setLoading(false);
  }, [loading]);

  useEffect(() => {
    fetchImages();
  }, []);

  const renderImage = useCallback(({ item }) => {
    const aspectRatio = aspectRatios[item.id] || 1;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { image: item, aspectRatio })}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: item.xt_image }}
          style={[styles.image, { aspectRatio }]}
          onLoad={({ nativeEvent }) => {
            setAspectRatios(prev => ({
              ...prev,
              [item.id]: nativeEvent.source.width / nativeEvent.source.height
            }));
          }}
        />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: ColorsBasedOnThem.Page_Background_Color }]}>
    <Text>my {URLs}</Text> 
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListFooterComponent={
          <CustomButton
            title={loading ? "Loading..." : "Click Here To Load More"}
            onPress={() => fetchImages(offset)}
            disabled={loading}
            bgColor={ColorsBasedOnThem.Button_Background_Color}
          />
        }
      />
    </View>
  );
}

export default memo(HomeScreen);
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  imageContainer: { marginBottom: 10 },
  image: { width: "100%", resizeMode: "contain" },
  loadMoreButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginTop: 20
  }
});
