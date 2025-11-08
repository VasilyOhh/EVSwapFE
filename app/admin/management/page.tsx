"use client";

import React, { useEffect, useMemo, useState } from "react";
import "antd/dist/reset.css";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
} from "antd";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // ✅ kiểm tra đăng nhập / quyền
const { Option } = Select;

type StationStatus = "OPEN" | "MAINTENANCE" | "CLOSED";
type Station = {
  stationID: number;
  stationName: string;
  address: string;
  status: StationStatus;
  operatingHours?: string;
  totalSlots: number;
  availableSlots: number;
  latitude?: number;
  longitude?: number;
  sohAvg?: number;
  createdAt?: string;
};

const emptyForm: Partial<Station> = {
  stationName: "",
  address: "",
  status: "OPEN",
  operatingHours: "24/7",
  totalSlots: 10,
  availableSlots: 5,
};

export default function Page() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth(); // ✅ dùng auth
  const API_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  );

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Station | null>(null);
  const [form, setForm] = useState<Partial<Station>>(emptyForm);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StationStatus | undefined>(
    undefined
  );

  // ✅ chỉ Admin mới được vào (case-insensitive)
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        message.warning("Vui lòng đăng nhập để truy cập.");
        router.push("/signin");
      } else {
        const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin";
        if (!isAdmin) {
          message.error("Bạn không có quyền truy cập trang này.");
          router.push("/");
        }
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  // ✅ khi đang kiểm tra quyền, tạm thời hiển thị loading
  if (isLoading) {
    return <p className="p-6">Đang kiểm tra quyền truy cập...</p>;
  }

  // ✅ nếu không phải admin => chặn hiển thị UI (tránh flicker)
  const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin";
  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const token =
    JSON.parse(localStorage.getItem("user") || "null")?.token ||
    localStorage.getItem("token") ||
    "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      const url = new URL(`${API_BASE}/api/stations`);
      url.searchParams.set("page", "0");
      url.searchParams.set("size", "100");
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Không thể tải danh sách trạm");
      const data = await res.json();
      const list: Station[] = (Array.isArray(data) ? data : data.content) ?? [];
      setStations(list);
    } catch (e: any) {
      message.error(e?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (st: Station) => {
    setEditing(st);
    setForm({ ...st });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/stations/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Xoá trạm thất bại");
      message.success("Đã xoá trạm");
      fetchStations();
    } catch (e: any) {
      message.error(e?.message || "Không xoá được trạm");
    }
  };

  const validateForm = () => {
    if (!form.stationName || !form.address) {
      Modal.error({
        title: "Thiếu dữ liệu",
        content: "Vui lòng nhập Tên trạm và Địa chỉ.",
      });
      return false;
    }
    const t = Number(form.totalSlots);
    const a = Number(form.availableSlots);
    if (Number.isNaN(t) || Number.isNaN(a) || t < 0 || a < 0) {
      Modal.error({
        title: "Dữ liệu không hợp lệ",
        content: "Số chỗ tổng và số chỗ trống phải là số không âm.",
      });
      return false;
    }
    if (a > t) {
      Modal.error({
        title: "Dữ liệu không hợp lệ",
        content: "Số chỗ trống không được lớn hơn số chỗ tổng.",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const payload = {
      stationName: form.stationName,
      address: form.address,
      status: (form.status ?? "OPEN") as StationStatus,
      operatingHours: form.operatingHours,
      totalSlots: Number(form.totalSlots),
      availableSlots: Number(form.availableSlots),
      latitude:
        form.latitude !== undefined && form.latitude !== null
          ? Number(form.latitude)
          : undefined,
      longitude:
        form.longitude !== undefined && form.longitude !== null
          ? Number(form.longitude)
          : undefined,
    };
    try {
      const res = await fetch(
        editing
          ? `${API_BASE}/api/stations/${editing.stationID}`
          : `${API_BASE}/api/stations`,
        {
          method: editing ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok)
        throw new Error(editing ? "Cập nhật thất bại" : "Thêm trạm thất bại");
      message.success(editing ? "Cập nhật thành công" : "Thêm trạm thành công");
      setIsModalOpen(false);
      fetchStations();
    } catch (e: any) {
      message.error(e?.message || "Lưu thất bại");
    }
  };

  const statusTag = (st: StationStatus) => {
    switch (st) {
      case "OPEN":
        return <Tag color="green">OPEN</Tag>;
      case "MAINTENANCE":
        return <Tag color="orange">MAINTENANCE</Tag>;
      default:
        return <Tag color="red">CLOSED</Tag>;
    }
  };

  const filtered = stations.filter((s) => {
    const bySearch =
      !search ||
      s.stationName.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    const byStatus = !statusFilter || s.status === statusFilter;
    return bySearch && byStatus;
  });

  const columns = [
    { title: "Mã trạm", dataIndex: "stationID", key: "stationID", width: 100 },
    {
      title: "Tên trạm",
      dataIndex: "stationName",
      key: "stationName",
      render: (t: string) => <b>{t}</b>,
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "MAINTENANCE", value: "MAINTENANCE" },
        { text: "CLOSED", value: "CLOSED" },
      ],
      onFilter: (v: any, r: Station) => r.status === v,
      render: (_: any, r: Station) => statusTag(r.status),
      width: 140,
    },
    {
      title: "Giờ hoạt động",
      dataIndex: "operatingHours",
      key: "operatingHours",
      width: 140,
    },
    {
      title: "Slots",
      key: "slots",
      width: 140,
      render: (_: any, r: Station) => (
        <span>
          {r.availableSlots}/{r.totalSlots}
        </span>
      ),
    },
    {
      title: "SoH (avg)",
      dataIndex: "sohAvg",
      key: "sohAvg",
      width: 110,
      render: (v: number | undefined) =>
        typeof v === "number" ? `${v.toFixed(1)}%` : "--",
    },
    {
      title: "Tác vụ",
      key: "actions",
      width: 160,
      render: (_: any, record: Station) => (
        <Space>
          <Button
            size="small"
            icon={<Pencil size={16} />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá trạm?"
            onConfirm={() => handleDelete(record.stationID)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<Trash2 size={16} />}>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">Quản lý trạm đổi pin</h1>
        <Space>
          <Input
            allowClear
            placeholder="Tìm theo tên/địa chỉ…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            style={{ width: 180 }}
          >
            <Option value="OPEN">OPEN</Option>
            <Option value="MAINTENANCE">MAINTENANCE</Option>
            <Option value="CLOSED">CLOSED</Option>
          </Select>
          <Button onClick={fetchStations} icon={<RefreshCw size={16} />}>
            Làm mới
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#dc2626", borderColor: "#dc2626" }}
            icon={<Plus />}
            onClick={openAddModal}
          >
            Thêm trạm
          </Button>
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns as any}
        dataSource={filtered}
        rowKey="stationID"
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* MODAL */}
      <Modal
        open={isModalOpen}
        title={editing ? "Chỉnh sửa trạm" : "Thêm trạm mới"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Huỷ"
        okButtonProps={{
          style: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
        }}
      >
        <div className="space-y-3">
          <label>Tên trạm</label>
          <Input
            value={form.stationName}
            onChange={(e) =>
              setForm({ ...form, stationName: e.target.value })
            }
          />

          <label>Địa chỉ</label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <label>Trạng thái</label>
          <Select
            value={form.status as StationStatus}
            onChange={(v) => setForm({ ...form, status: v })}
            style={{ width: "100%" }}
          >
            <Option value="OPEN">OPEN</Option>
            <Option value="MAINTENANCE">MAINTENANCE</Option>
            <Option value="CLOSED">CLOSED</Option>
          </Select>

          <label>Giờ hoạt động</label>
          <Input
            value={form.operatingHours}
            onChange={(e) =>
              setForm({ ...form, operatingHours: e.target.value })
            }
            placeholder="VD: 06:00–22:00 hoặc 24/7"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Tổng chỗ (slots)</label>
              <Input
                type="number"
                value={form.totalSlots}
                onChange={(e) =>
                  setForm({ ...form, totalSlots: Number(e.target.value) })
                }
                min={0}
              />
            </div>
            <div>
              <label>Chỗ trống</label>
              <Input
                type="number"
                value={form.availableSlots}
                onChange={(e) =>
                  setForm({
                    ...form,
                    availableSlots: Number(e.target.value),
                  })
                }
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Vĩ độ (lat)</label>
              <Input
                type="number"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label>Kinh độ (lng)</label>
              <Input
                type="number"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
