import { Form, Input, FormItemProps } from 'antd';
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import type { GetProps } from 'antd';
import { ComponentType } from '../../types';
import { isNull } from '../../utils/util';
import { FormContext } from '../../utils/context';

type OTPProps = GetProps<typeof Input.OTP>;

/* 泛型只需要定义组件本身用到的属性，当然也可以不定义，默认为any */
export interface IConfig {
  defaultValue: string;
  formItem: FormItemProps;
  formWrap: OTPProps & { fmt: string };
}

/**
 *
 * @param config 组件配置属性值
 * @param props 系统属性值：componentid、componentname等
 * @returns 返回组件
 */
const MInputPassword = ({ id, type, config, onChange }: ComponentType<IConfig>, ref: any) => {
  const form = useContext(FormContext);
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  // 初始化默认值
  useEffect(() => {
    const name: string = config.props.formItem?.name;
    const value = config.props.defaultValue;
    // 日期组件初始化值
    if (name && !isNull(value)) {
      form?.setFieldValue(name, value);
    }
  }, [config.props.defaultValue]);

  // 启用和禁用
  useEffect(() => {
    setDisabled(config.props.formWrap.disabled || false);
  }, [config.props.formWrap.disabled]);

  const handleChange = (val: string) => {
    onChange?.({
      [config.props.formItem.name]: val,
    });
  };
  useImperativeHandle(ref, () => {
    return {
      show() {
        setVisible(true);
      },
      hide() {
        setVisible(false);
      },
      enable() {
        setDisabled(false);
      },
      disable() {
        setDisabled(true);
      },
    };
  });
  return (
    visible && (
      <Form.Item {...config.props.formItem} data-id={id} data-type={type}>
        <Input.OTP
          {...config.props.formWrap}
          disabled={disabled}
          variant={config.props.formWrap.variant || undefined}
          style={config.style}
          onChange={handleChange}
        />
      </Form.Item>
    )
  );
};

export default forwardRef(MInputPassword);
