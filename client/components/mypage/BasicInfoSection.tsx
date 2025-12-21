import React from "react";
import FieldRow from "@/components/common/FieldRow";
import SelectInput from "@/components/common/SelectInput";
import TextInput from "@/components/common/TextInput";

interface BasicInfoSectionProps {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  location: string;
  nickname: string;
  readOnly: boolean;
  onChangeBirth: (part: "year" | "month" | "day", value: string) => void;
  onChangeLocation: (value: string) => void;
  onChangeNickname: (value: string) => void;
}

const years = Array.from({ length: 70 }).map((_, idx) => `${1955 + idx}`);
const months = Array.from({ length: 12 }).map((_, idx) => `${idx + 1}`.padStart(2, "0"));
const days = Array.from({ length: 31 }).map((_, idx) => `${idx + 1}`.padStart(2, "0"));

export default function BasicInfoSection({
  birthYear,
  birthMonth,
  birthDay,
  location,
  nickname,
  readOnly,
  onChangeBirth,
  onChangeLocation,
  onChangeNickname,
}: BasicInfoSectionProps) {
  // Region tree (copied from signup page)
  const REGION_TREE: Record<string, Record<string, string[]>> = {
  '서울특별시': {
    '종로구': [],
    '중구': [],
    '용산구': [],
    '성동구': [],
    '광진구': [],
    '동대문구': [],
    '중랑구': [],
    '성북구': [],
    '강북구': [],
    '도봉구': [],
    '노원구': [],
    '은평구': [],
    '서대문구': [],
    '마포구': [],
    '양천구': [],
    '강서구': [],
    '구로구': [],
    '금천구': [],
    '영등포구': [],
    '동작구': [],
    '관악구': [],
    '서초구': [],
    '강남구': [],
    '송파구': [],
    '강동구': [],
  },

  '부산광역시': {
    '중구': [],
    '서구': [],
    '동구': [],
    '영도구': [],
    '부산진구': [],
    '동래구': [],
    '남구': [],
    '북구': [],
    '해운대구': [],
    '사하구': [],
    '금정구': [],
    '강서구': [],
    '연제구': [],
    '수영구': [],
    '사상구': [],
    '기장군': [],
  },

  '대구광역시': {
    '중구': [],
    '동구': [],
    '서구': [],
    '남구': [],
    '북구': [],
    '수성구': [],
    '달서구': [],
    '달성군': [],
  },

  '인천광역시': {
    '중구': [],
    '동구': [],
    '미추홀구': [],
    '연수구': [],
    '남동구': [],
    '부평구': [],
    '계양구': [],
    '서구': [],
    '강화군': [],
    '옹진군': [],
  },

  '광주광역시': {
    '동구': [],
    '서구': [],
    '남구': [],
    '북구': [],
    '광산구': [],
  },

  '대전광역시': {
    '동구': [],
    '중구': [],
    '서구': [],
    '유성구': [],
    '대덕구': [],
  },

  '울산광역시': {
    '중구': [],
    '남구': [],
    '동구': [],
    '북구': [],
    '울주군': [],
  },

  '세종특별자치시': {
    '세종특별자치시': [],
  },

  '경기도': {
    '수원시': ['장안구', '권선구', '팔달구', '영통구'],
    '성남시': ['수정구', '중원구', '분당구'],
    '안양시': ['만안구', '동안구'],
    '부천시': ['중구', '원미구', '남구', '소사구', '오정구'],
    '안산시': ['상록구', '단원구'],
    '고양시': ['덕양구', '일산동구', '일산서구'],
    '용인시': ['처인구', '기흥구', '수지구'],
    '의정부시': [],
    '광명시': [],
    '평택시': [],
    '동두천시': [],
    '과천시': [],
    '구리시': [],
    '남양주시': [],
    '오산시': [],
    '시흥시': [],
    '군포시': [],
    '의왕시': [],
    '하남시': [],
    '파주시': [],
    '이천시': [],
    '안성시': [],
    '김포시': [],
    '화성시': [],
    '광주시': [],
    '여주시': [],
    '양평군': [],
    '연천군': [],
    '포천시': [],
    '가평군': [],
  },

  '강원도': {
    '춘천시': [],
    '원주시': [],
    '강릉시': [],
    '동해시': [],
    '태백시': [],
    '속초시': [],
    '삼척시': [],
    '홍천군': [],
    '횡성군': [],
    '영월군': [],
    '평창군': [],
    '정선군': [],
    '철원군': [],
    '화천군': [],
    '양구군': [],
    '인제군': [],
    '고성군': [],
    '양양군': [],
  },

  '충청북도': {
    '청주시': ['상당구', '서원구', '흥덕구', '청원구'],
    '충주시': [],
    '제천시': [],
    '보은군': [],
    '옥천군': [],
    '영동군': [],
    '증평군': [],
    '진천군': [],
    '괴산군': [],
    '음성군': [],
    '단양군': [],
  },

  '충청남도': {
    '천안시': ['동남구', '서북구'],
    '공주시': [],
    '보령시': [],
    '아산시': [],
    '서산시': [],
    '논산시': [],
    '계룡시': [],
    '당진시': [],
    '금산군': [],
    '부여군': [],
    '서천군': [],
    '청양군': [],
    '홍성군': [],
    '예산군': [],
    '태안군': [],
  },

  '전라북도': {
    '전주시': ['완산구', '덕진구'],
    '군산시': [],
    '익산시': [],
    '정읍시': [],
    '남원시': [],
    '김제시': [],
    '완주군': [],
    '진안군': [],
    '무주군': [],
    '장수군': [],
    '임실군': [],
    '순창군': [],
    '고창군': [],
    '부안군': [],
  },

  '전라남도': {
    '목포시': [],
    '여수시': [],
    '순천시': [],
    '나주시': [],
    '광양시': [],
    '담양군': [],
    '곡성군': [],
    '구례군': [],
    '고흥군': [],
    '보성군': [],
    '화순군': [],
    '장흥군': [],
    '강진군': [],
    '해남군': [],
    '영암군': [],
    '무안군': [],
    '함평군': [],
    '영광군': [],
    '장성군': [],
    '완도군': [],
    '진도군': [],
    '신안군': [],
  },

  '경상북도': {
    '포항시': ['남구', '북구'],
    '경주시': [],
    '김천시': [],
    '안동시': [],
    '구미시': [],
    '영주시': [],
    '영천시': [],
    '상주시': [],
    '문경시': [],
    '경산시': [],
    '군위군': [],
    '의성군': [],
    '청송군': [],
    '영양군': [],
    '영덕군': [],
    '청도군': [],
    '고령군': [],
    '성주군': [],
    '칠곡군': [],
    '예천군': [],
    '봉화군': [],
    '울진군': [],
    '울릉군': [],
  },

  '경상남도': {
    '창원시': ['의창구', '성산구', '마산합포구', '마산회원구', '진해구'],
    '진주시': [],
    '통영시': [],
    '사천시': [],
    '김해시': [],
    '밀양시': [],
    '거제시': [],
    '양산시': [],
    '의령군': [],
    '함안군': [],
    '창녕군': [],
    '고성군': [],
    '남해군': [],
    '하동군': [],
    '산청군': [],
    '함양군': [],
    '거창군': [],
    '합천군': [],
  },

  '제주특별자치도': {
    '제주시': [],
    '서귀포시': [],
  },
};

  // normalize provine name variants (e.g. '서울시' -> '서울특별시')
  const PROVINCE_ALIAS: Record<string, string> = {
    "서울시": "서울특별시",
    "부산시": "부산광역시",
    "대구시": "대구광역시",
    "인천시": "인천광역시",
    "광주시": "광주광역시",
    "대전시": "대전광역시",
    "울산시": "울산광역시",
    "세종시": "세종특별자치시",
    "제주도": "제주특별자치도",
  };

  const normalizeProvince = (p?: string) => {
    if (!p) return "";
    return PROVINCE_ALIAS[p] || p;
  };

  // parse location string '시도 시군구 읍면동' and normalize province name
  const parseLocation = (loc?: string) => {
    if (!loc) return { province: "", city: "", district: "" };
    const parts = loc.split(" ").filter((p) => p.length > 0);
    return {
      province: normalizeProvince(parts[0] || ""),
      city: parts[1] || "",
      district: parts[2] || "",
    };
  };

  const [province, setProvince] = React.useState<string>(parseLocation(location).province);
  const [city, setCity] = React.useState<string>(parseLocation(location).city);
  const [district, setDistrict] = React.useState<string>(parseLocation(location).district);

  // sync when prop location changes
  React.useEffect(() => {
    const p = parseLocation(location);
    setProvince(p.province);
    setCity(p.city);
    setDistrict(p.district);
  }, [location]);

  // update combined location when any part changes
  React.useEffect(() => {
    if (!province) return onChangeLocation("");
    const parts = [province];
    if (city) parts.push(city);
    if (district) parts.push(district);
    onChangeLocation(parts.join(" "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province, city, district]);

  return (
    <div className="grid gap-5 text-sm text-[#3b4350] sm:grid-cols-2">
      <FieldRow label="생년월일">
  <div className="grid w-full grid-cols-3 gap-2">
    <div className="flex items-center gap-2">
      <SelectInput
        readOnly={readOnly}
        selectProps={{
          className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${birthYear ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
          value: birthYear,
          onChange: (e) => onChangeBirth("year", e.target.value),
        }}
      >
        <option value="" disabled hidden>년도</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </SelectInput>
      <span className="shrink-0 text-xs text-[#8a8f99]">년</span>
    </div>

    <div className="flex items-center gap-2">
      <SelectInput
        readOnly={readOnly}
        selectProps={{
          className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${birthMonth ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
          value: birthMonth,
          onChange: (e) => onChangeBirth("month", e.target.value),
        }}
      >
        <option value="" disabled hidden>월</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </SelectInput>
      <span className="shrink-0 text-xs text-[#8a8f99]">월</span>
    </div>

    <div className="flex items-center gap-2">
      <SelectInput
        readOnly={readOnly}
        selectProps={{
          className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${birthDay ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
          value: birthDay,
          onChange: (e) => onChangeBirth("day", e.target.value),
        }}
      >
        <option value="" disabled hidden>일</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </SelectInput>
      <span className="shrink-0 text-xs text-[#8a8f99]">일</span>
    </div>
  </div>
</FieldRow>


      <FieldRow label="거주 지역">
  {/* 기존 grid-cols-2 gap-3을 flex gap-2로 수정 */}
  <div className="flex w-full gap-2">
    <div className="flex-1">
      <SelectInput
        readOnly={readOnly}
        selectProps={{
          className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${province ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
          disabled: readOnly,
          value: province,
          onChange: (e) => {
            setProvince(e.target.value);
            setCity("");
            setDistrict("");
          },
        }}
      >
        <option value="" disabled hidden>시/도</option>
        {Object.keys(REGION_TREE).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </SelectInput>
    </div>

    <div className="flex-1">
      <SelectInput
        readOnly={readOnly}
        selectProps={{
          className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${city ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
          value: city,
          onChange: (e) => {
            setCity(e.target.value);
            setDistrict("");
          },
          disabled: !province || readOnly,
        }}
      >
        <option value="" disabled hidden>시/군/구</option>
        {Object.keys(REGION_TREE[province] || {}).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </SelectInput>
    </div>

    {(() => {
      const districtOptions = REGION_TREE[province]?.[city] ?? [];
      const showDistrict = districtOptions.length > 0 || Boolean(district);
      if (!showDistrict) return null;
      return (
        <div className="flex-1"> {/* 3번째 박스도 동일한 비율 유지 */}
          <SelectInput
            readOnly={readOnly}
            selectProps={{
              className: `w-full border border-[#e6e9ee] rounded px-3 py-2 ${readOnly ? 'bg-[#f7f8fa]' : 'bg-white'} ${district ? 'text-[#3b4350]' : 'text-[#8a8f99]'} disabled:cursor-not-allowed disabled:bg-[#f5f6f8]`,
              disabled: readOnly,
              value: district,
              onChange: (e) => setDistrict(e.target.value),
            }}
          >
            <option value="" disabled hidden>구</option>
            {districtOptions.length > 0
              ? districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))
              : district ? (
                  <option value={district}>{district}</option>
                ) : null}
          </SelectInput>
        </div>
      );
    })()}
  </div>
</FieldRow>

      <FieldRow label="닉네임">
        <TextInput
          readOnly={readOnly}
          inputProps={{
            value: nickname,
            onChange: (e) => onChangeNickname(e.target.value),
            placeholder: "닉네임을 입력하세요",
          }}
        />
      </FieldRow>
    </div>
  );
}
