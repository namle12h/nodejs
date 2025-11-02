
import { useState, useEffect } from "react";
import { Select, message, Form } from "antd";

interface Location {
  id: number;
  full_name: string;
  [key: string]: any;
}

const { Option } = Select;

interface AddressSelectorProps {
  form: any;
  cities: Location[];
  setCities: (cities: Location[]) => void;
  districts: Location[];
  setDistricts: (districts: Location[]) => void;
  communes: Location[];
  setCommunes: (communes: Location[]) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  form,
  cities,
  setCities,
  districts,
  setDistricts,
  communes,
  setCommunes,
}) => {
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  const [selectedCity, setSelectedCity] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const data = await res.json();
        if (data.error === 0) setCities(data.data);
        else message.error("Không thể tải danh sách tỉnh/thành.");
      } catch {
        message.error("Lỗi khi tải tỉnh/thành phố.");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [setCities]);

  const handleCityChange = async (cityId: number) => {
    const city = cities.find((c) => c.id === cityId);
    setSelectedCity(city || null);
    form.setFieldsValue({
      cityName: city?.full_name,
      districtName: undefined,
      communeName: undefined,
    });

    setLoadingDistricts(true);
    setDistricts([]);
    setCommunes([]);

    try {
      const res = await fetch(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`);
      const data = await res.json();
      if (data.error === 0) setDistricts(data.data);
      else message.error("Không thể tải quận/huyện.");
    } catch {
      message.error("Lỗi tải quận/huyện.");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictChange = async (districtId: number) => {
    const district = districts.find((d) => d.id === districtId);
    setSelectedDistrict(district || null);
    form.setFieldsValue({
      districtName: district?.full_name,
      communeName: undefined,
    });

    setLoadingCommunes(true);
    setCommunes([]);

    try {
      const res = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await res.json();
      if (data.error === 0) setCommunes(data.data);
      else message.error("Không thể tải phường/xã.");
    } catch {
      message.error("Lỗi tải phường/xã.");
    } finally {
      setLoadingCommunes(false);
    }
  };

  const handleCommuneChange = (communeId: number) => {
    const commune = communes.find((c) => c.id === communeId);
    form.setFieldsValue({
      communeName: commune?.full_name,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Form.Item
        name="cityName"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
      >
        <Select
          placeholder="Chọn tỉnh/thành phố"
          onChange={handleCityChange}
          loading={loadingCities}
          className="rounded-lg w-full"
        >
          {cities.map((city) => (
            <Option key={city.id} value={city.id}>
              {city.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="districtName"
        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
      >
        <Select
          placeholder="Chọn quận/huyện"
          onChange={handleDistrictChange}
          loading={loadingDistricts}
          disabled={!selectedCity}
          className="rounded-lg w-full"
        >
          {districts.map((district) => (
            <Option key={district.id} value={district.id}>
              {district.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="communeName"
        rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
      >
        <Select
          placeholder="Chọn phường/xã"
          onChange={handleCommuneChange}
          loading={loadingCommunes}
          disabled={!selectedDistrict}
          className="rounded-lg w-full"
        >
          {communes.map((commune) => (
            <Option key={commune.id} value={commune.id}>
              {commune.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default AddressSelector;
